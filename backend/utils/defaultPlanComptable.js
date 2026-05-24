export const planComptables = [
  { code: "10", label: "Capital" },
  { code: "101", label: "Capital social" },
  { code: "1011", label: "Capital souscrit - non appelé" },
  { code: "1012", label: "Capital souscrit - appelé, non libéré" },
  { code: "1013", label: "Capital souscrit - appelé, libéré" },
  { code: "10131", label: "Capital non amorti" },
  { code: "10132", label: "Capital amorti" },
  { code: "1018", label: "Capital souscrit soumis à des réglementations spécifiques" },
  { code: "105", label: "Fonds de dotation" },
  { code: "108", label: "Compte de l’exploitant" },
  { code: "109", label: "Actionnaires - capital souscrit non appelé" },

  { code: "11", label: "Réserves et primes liées au capital" },
  { code: "111", label: "Réserve légale" },
  { code: "112", label: "Réserves statutaires" },
  { code: "117", label: "Primes liées au capital" },
  { code: "1171", label: "Prime d’émission" },
  { code: "1172", label: "Prime de fusion" },
  { code: "1173", label: "Prime d’apport" },
  { code: "1174", label: "Prime de conversion d’obligations" },
  { code: "1178", label: "Autres primes" },
  { code: "118", label: "Autres réserves" },
  { code: "1181", label: "Réserves du fonds social" },
  { code: "119", label: "Capitaux propres des actionnaires" },

  { code: "12", label: "Résultats reportés" },
  { code: "121", label: "Résultats reportés" },
  { code: "128", label: "Ajustements comptables affectant les résultats reportés" },

  { code: "13", label: "Résultat net de l’exercice" },
  { code: "131", label: "Bénéfice" },
  { code: "135", label: "Perte" },

  { code: "14", label: "Autres capitaux propres" },
  { code: "141", label: "Titres soumis à des réglementations spécifiques" },
  { code: "142", label: "Réserves réglementées & réserves fiscales spéciales" },
  { code: "1421", label: "Réserves bloquées" },
  { code: "143", label: "Amortissement spécial" },
  { code: "144", label: "Réserve de réévaluation" },
  { code: "145", label: "Subventions d’investissement" },
  { code: "1451", label: "Subventions d’investissement" },
  { code: "1458", label: "Autres subventions d’investissement" },
  { code: "1459", label: "Subventions d’investissement inscrites en résultat" },
  { code: "147", label: "Compte du bailleur de fonds" },

  { code: "15", label: "Provisions pour risques et charges" },
  { code: "151", label: "Provisions pour risques" },
  { code: "1511", label: "Provisions pour litiges" },
  { code: "1512", label: "Provisions pour garanties" },
  { code: "1513", label: "Provisions pour pertes sur contrats futurs" },
  { code: "1514", label: "Provisions pour amendes et pénalités" },
  { code: "1515", label: "Provisions pour pertes de change" },
  { code: "1518", label: "Autres provisions pour risques" },

  { code: "16", label: "Emprunts et dettes assimilées" },
  { code: "161", label: "Emprunts obligataires" },
  { code: "1611", label: "Emprunts obligataires convertibles" },
  { code: "1618", label: "Autres emprunts obligataires" },
  { code: "162", label: "Emprunts auprès des institutions financières" },
  { code: "1621", label: "Emprunts bancaires" },
  { code: "1626", label: "Refinancement obtenu" },

  { code: "20", label: "Immobilisations incorporelles" },
  { code: "21", label: "Immobilisations incorporelles" },
  { code: "211", label: "Investissements en R&D" },
  { code: "212", label: "Concessions, brevets, licences" },
  { code: "213", label: "Logiciels" },
  { code: "214", label: "Fonds commercial (goodwill)" },

  { code: "22", label: "Immobilisations corporelles" },
  { code: "221", label: "Terrains" },
  { code: "2213", label: "Terrains nus" },
  { code: "2214", label: "Terrains aménagés" },
  { code: "222", label: "Bâtiments" },
  { code: "2221", label: "Bâtiments" },

  { code: "31", label: "Matières premières" },
  { code: "311", label: "Matières premières" },

  { code: "32", label: "Autres approvisionnements" },
  { code: "321", label: "Matériels consommables" },

  { code: "40", label: "Fournisseurs" },
  { code: "401", label: "Fournisseurs de biens et services" },
  { code: "4011", label: "Fournisseurs - achats" },

  { code: "41", label: "Clients" },
  { code: "411", label: "Clients" },
  { code: "4111", label: "Clients - ventes" },

  { code: "43", label: "État" },
  { code: "436", label: "TVA" },
  { code: "43651", label: "TVA à payer" },
  { code: "43671", label: "TVA collectée" },

  { code: "50", label: "Emprunts à court terme" },
  { code: "501", label: "Crédits d’exploitation" },

  { code: "53", label: "Banques" },
  { code: "532", label: "Comptes bancaires" },
  { code: "5321", label: "Comptes en dinars" },

  { code: "54", label: "Caisse" },
  { code: "541", label: "Caisse siège" },

  { code: "60", label: "Achats" },
  { code: "601", label: "Achats de matières premières" },
  { code: "607", label: "Achats de marchandises" },

  { code: "61", label: "Services extérieurs" },
  { code: "611", label: "Sous-traitance" },

  { code: "62", label: "Autres services extérieurs" },
  { code: "622", label: "Honoraires" },

  { code: "64", label: "Charges de personnel" },
  { code: "6400", label: "Salaires" },

  { code: "65", label: "Charges financières" },
  { code: "651", label: "Charges d’intérêts" },

  { code: "66", label: "Impôts et taxes" },
  { code: "665", label: "Autres impôts" },

  { code: "70", label: "Ventes" },
  { code: "701", label: "Ventes de produits finis" },
  { code: "707", label: "Ventes de marchandises" },

  { code: "75", label: "Produits financiers" },
  { code: "751", label: "Produits des investissements" },
];