/**
 * Génère des comptes de démonstration (1 administrateur, 2 conducteurs de
 * prière) dans le projet Supabase configuré via .env.local.
 *
 * Usage : npm run db:seed
 *
 * Utilise l'API Admin de Supabase (clé de service) plutôt que du SQL brut
 * dans auth.users, pour que les mots de passe soient hachés exactement
 * comme le ferait Supabase Auth en production.
 */
import "dotenv/config";

import { createClient } from "@supabase/supabase-js";

import type { Database, UserRole } from "../src/shared/types/database";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Mot de passe commun aux comptes de démonstration — développement uniquement. */
const SEED_PASSWORD = "EjpHub-Demo-2026!";

interface SeedUser {
  email: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  phone: string;
}

const SEED_USERS: SeedUser[] = [
  {
    email: "admin@ejp-hub.test",
    firstname: "Alice",
    lastname: "Administrateur",
    role: "ADMIN",
    phone: "+33600000001",
  },
  {
    email: "conducteur1@ejp-hub.test",
    firstname: "Marc",
    lastname: "Dupont",
    role: "PRAYER_LEADER",
    phone: "+33600000002",
  },
  {
    email: "conducteur2@ejp-hub.test",
    firstname: "Sarah",
    lastname: "Nguyen",
    role: "PRAYER_LEADER",
    phone: "+33600000003",
  },
];

async function main() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être renseignées dans .env.local avant de lancer le seed.",
    );
    process.exitCode = 1;
    return;
  }

  const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("Création des comptes de démonstration…\n");

  for (const seedUser of SEED_USERS) {
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: seedUser.email,
      password: SEED_PASSWORD,
      email_confirm: true,
      user_metadata: {
        firstname: seedUser.firstname,
        lastname: seedUser.lastname,
        role: seedUser.role,
      },
    });

    if (createError) {
      // Un compte déjà existant n'est pas une erreur bloquante pour un re-run du seed.
      console.warn(`⚠️  ${seedUser.email} : ${createError.message}`);
      continue;
    }

    const userId = created.user.id;

    // Le trigger `handle_new_user` crée déjà le profil (firstname/lastname/role) ;
    // on complète ici les champs qu'il ne connaît pas (téléphone).
    const { error: updateError } = await supabase.from("profiles").update({ phone: seedUser.phone }).eq("id", userId);

    if (updateError) {
      console.warn(`⚠️  Profil ${seedUser.email} créé mais non complété : ${updateError.message}`);
      continue;
    }

    console.log(`✅ ${seedUser.role.padEnd(13)} ${seedUser.email}`);
  }

  console.log("\nMot de passe commun (développement uniquement) :", SEED_PASSWORD);
  console.log("\nNe jamais utiliser ces comptes ou ce mot de passe en production.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
