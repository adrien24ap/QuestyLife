"use client";

import type { Session } from "@supabase/supabase-js";
import { Cloud, Download, LogOut, Mail, Upload } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { applyQuestyLifeData, collectQuestyLifeData, type QuestyLifeCloudPayload } from "@/lib/questylifeData";
import { getSupabaseClient } from "@/lib/supabase";
import { STORAGE_SYNC_EVENT } from "@/lib/storage";

type CloudRow = {
  payload: QuestyLifeCloudPayload | null;
  updated_at: string | null;
};

export function CloudSync() {
  const supabase = getSupabaseClient();
  const [email, setEmail] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState("Prêt.");
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const applyingRemote = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!session) return;
    void loadFromCloud(true);
  }, [session]);

  useEffect(() => {
    if (!supabase || !session) return;

    function queueSave() {
      if (applyingRemote.current) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void saveToCloud(true);
      }, 900);
    }

    window.addEventListener(STORAGE_SYNC_EVENT, queueSave);
    return () => {
      window.removeEventListener(STORAGE_SYNC_EVENT, queueSave);
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [session, supabase]);

  if (!supabase) {
    return (
      <section className="card">
        <h2>Synchronisation cloud</h2>
        <p className="subtle">
          Supabase n'est pas encore configuré. L'application fonctionne toujours en local, mais les données ne peuvent pas encore être partagées entre téléphone et ordinateur.
        </p>
        <p className="subtle">
          Suis le fichier <strong>SUPABASE_SETUP.md</strong>, puis ajoute les variables Supabase dans Vercel.
        </p>
      </section>
    );
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !email.trim()) return;

    setLoading(true);
    setStatus("Envoi du lien de connexion...");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/sync`
      }
    });

    if (error) {
      setStatus(`Erreur : ${error.message}`);
    } else {
      setStatus("Lien envoyé. Ouvre ton email sur cet appareil pour te connecter.");
    }
    setLoading(false);
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setStatus("Déconnecté.");
  }

  async function loadFromCloud(silent = false) {
    if (!supabase || !session) return;

    if (!silent) setLoading(true);
    setStatus("Récupération des données cloud...");

    const { data, error } = await supabase
      .from("questylife_data")
      .select("payload, updated_at")
      .eq("user_id", session.user.id)
      .maybeSingle<CloudRow>();

    if (error) {
      setStatus(`Erreur de récupération : ${error.message}`);
    } else if (data?.payload) {
      applyingRemote.current = true;
      applyQuestyLifeData(data.payload);
      window.setTimeout(() => {
        applyingRemote.current = false;
      }, 300);
      setLastSync(data.updated_at);
      setStatus("Données cloud récupérées sur cet appareil.");
    } else {
      await saveToCloud(true);
      setStatus("Premier espace cloud créé avec les données de cet appareil.");
    }

    if (!silent) setLoading(false);
  }

  async function saveToCloud(silent = false) {
    if (!supabase || !session) return;

    if (!silent) setLoading(true);
    const now = new Date().toISOString();
    const payload = collectQuestyLifeData();

    const { error } = await supabase.from("questylife_data").upsert(
      {
        user_id: session.user.id,
        payload,
        updated_at: now
      },
      { onConflict: "user_id" }
    );

    if (error) {
      setStatus(`Erreur de sauvegarde : ${error.message}`);
    } else {
      setLastSync(now);
      setStatus(silent ? "Synchronisé." : "Données sauvegardées dans le cloud.");
    }

    if (!silent) setLoading(false);
  }

  return (
    <section className="card">
      <div className="metric-row">
        <div>
          <h2>Synchronisation cloud</h2>
          <p className="subtle">{status}</p>
        </div>
        <span className="brand-mark">
          <Cloud size={20} aria-hidden="true" />
        </span>
      </div>

      {!session ? (
        <form className="form-grid" onSubmit={signIn} style={{ marginTop: 16 }}>
          <div className="field">
            <label htmlFor="sync-email">Email</label>
            <input
              className="input"
              id="sync-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ton.email@example.com"
              type="email"
              value={email}
            />
          </div>
          <button className="btn" disabled={loading} type="submit">
            <Mail size={18} aria-hidden="true" />
            Recevoir le lien de connexion
          </button>
        </form>
      ) : (
        <div className="grid" style={{ marginTop: 16 }}>
          <p className="subtle">Connecté avec {session.user.email}</p>
          {lastSync ? <p className="subtle">Dernière synchro : {new Date(lastSync).toLocaleString("fr-BE")}</p> : null}
          <div className="actions">
            <button className="btn" disabled={loading} onClick={() => saveToCloud(false)} type="button">
              <Upload size={18} aria-hidden="true" />
              Envoyer mes données
            </button>
            <button className="btn secondary" disabled={loading} onClick={() => loadFromCloud(false)} type="button">
              <Download size={18} aria-hidden="true" />
              Récupérer le cloud
            </button>
            <button className="btn warning" onClick={signOut} type="button">
              <LogOut size={18} aria-hidden="true" />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
