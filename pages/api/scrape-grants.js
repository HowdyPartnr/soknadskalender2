// pages/api/scrape-grants.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all grants
    const allGrants = getSupplementalGrants();

    res.status(200).json({ grants: allGrants, total: allGrants.length });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to fetch grants', grants: [] });
  }
}

function getSupplementalGrants() {
  return [
    { id: 'g1', name: "Kulturrådet - Prosjektstøtte 2025", organization: "Kulturrådet", amount: 500000, deadline: "2025-03-15", category: "Kultur", targetGroup: "Kulturorganisasjoner", description: "Støtte til kulturprosjekter og arrangementer", applicationUrl: "https://kulturradet.no/sok-stotte" },
    { id: 'g2', name: "Frifond - Barn og ungdom", organization: "Frifond", amount: 75000, deadline: "2026-02-28", category: "Barn og ungdom", targetGroup: "Ungdomsorganisasjoner", description: "Tilskudd til aktiviteter", applicationUrl: "https://frifond.no" },
    { id: 'g3', name: "Sparebankstiftelsen DNB", organization: "Sparebankstiftelsen DNB", amount: 800000, deadline: "2025-04-01", category: "Samfunn", targetGroup: "Allmennyttige organisasjoner", description: "Støtte til samfunnsnyttige prosjekter", applicationUrl: "https://sparebankstiftelsen.no" },
    { id: 'g4', name: "Helsedirektoratet - Forebygging", organization: "Helsedirektoratet", amount: 600000, deadline: "2025-06-01", category: "Helse", targetGroup: "Helseorganisasjoner", description: "Forebyggende helsearbeid", applicationUrl: "https://helsedirektoratet.no" },
    { id: 'g5', name: "Miljødirektoratet - Grønne tiltak", organization: "Miljødirektoratet", amount: 300000, deadline: "2025-05-15", category: "Miljø", targetGroup: "Miljøorganisasjoner", description: "Lokale miljøtiltak", applicationUrl: "https://miljodirektoratet.no" },
    { id: 'g6', name: "Forskningsrådet - Innovasjon", organization: "Norges forskningsråd", amount: 1500000, deadline: "2025-09-01", category: "Forskning", targetGroup: "Forskningsinstitusjoner", description: "Innovative prosjekter", applicationUrl: "https://forskningsradet.no" },
    { id: 'g7', name: "Bufdir - Inkludering", organization: "Bufdir", amount: 400000, deadline: "2025-08-20", category: "Barn og ungdom", targetGroup: "Frivillige organisasjoner", description: "Inkluderingstiltak", applicationUrl: "https://bufdir.no" },
    { id: 'g8', name: "Extra Stiftelsen - Dugnad", organization: "Extra Stiftelsen", amount: 50000, deadline: "2025-12-31", category: "Lokalsamfunn", targetGroup: "Lag og foreninger", description: "Dugnadsinnsats", applicationUrl: "https://extra.no/stiftelsen" },
    { id: 'g9', name: "Norsk Tipping - Grasrotandelen", organization: "Norsk Tipping", amount: 35000, deadline: "2025-11-30", category: "Idrett", targetGroup: "Idrettslag", description: "Støtte til lokale idrettslag", applicationUrl: "https://norsk-tipping.no/grasrotandelen" },
    { id: 'g10', name: "Helsedirektoratet - Psykisk helse", organization: "Helsedirektoratet", amount: 450000, deadline: "2025-07-15", category: "Helse", targetGroup: "Helseorganisasjoner", description: "Tilskudd til psykisk helsearbeid", applicationUrl: "https://helsedirektoratet.no" },
    { id: 'g11', name: "Kulturrådet - Musikkstøtte", organization: "Kulturrådet", amount: 250000, deadline: "2025-05-20", category: "Kultur", targetGroup: "Musikkorganisasjoner", description: "Støtte til musikkprosjekter", applicationUrl: "https://kulturradet.no" },
    { id: 'g12', name: "Integrerings- og mangfoldsdirektoratet", organization: "IMDi", amount: 350000, deadline: "2025-06-30", category: "Samfunn", targetGroup: "Integreringsorganisasjoner", description: "Tilskudd til integreringsarbeid", applicationUrl: "https://imdi.no" },
    { id: 'g13', name: "Utdanningsdirektoratet - Voksenopplæring", organization: "Udir", amount: 200000, deadline: "2025-04-15", category: "Utdanning", targetGroup: "Utdanningsinstitusjoner", description: "Støtte til voksenopplæring", applicationUrl: "https://udir.no" },
    { id: 'g14', name: "Lotteri- og stiftelsestilsynet", organization: "Lottstift", amount: 150000, deadline: "2025-09-15", category: "Samfunn", targetGroup: "Frivillige organisasjoner", description: "Generell organisasjonsstøtte", applicationUrl: "https://lottstift.no" },
    { id: 'g15', name: "Klimasats", organization: "Enova", amount: 500000, deadline: "2025-10-01", category: "Miljø", targetGroup: "Miljøorganisasjoner", description: "Støtte til klimatiltak", applicationUrl: "https://enova.no" },
    { id: 'g16', name: "Innovasjon Norge - Etablererstipend", organization: "Innovasjon Norge", amount: 250000, deadline: "2025-08-01", category: "Næring", targetGroup: "Gründere", description: "Støtte til nyetableringer", applicationUrl: "https://innovasjonnorge.no" },
    { id: 'g17', name: "Fylkesmannen - Frivillighetstilskudd", organization: "Fylkesmannen", amount: 100000, deadline: "2025-05-01", category: "Samfunn", targetGroup: "Frivillige organisasjoner", description: "Regional frivillighetsstøtte", applicationUrl: "https://fylkesmannen.no" },
    { id: 'g18', name: "Kunnskapsdepartementet - Forskning", organization: "KD", amount: 2000000, deadline: "2025-11-01", category: "Forskning", targetGroup: "Universiteter", description: "Forskningsmidler", applicationUrl: "https://kd.dep.no" },
    { id: 'g19', name: "Velferdstilskudd idrett", organization: "Norges idrettsforbund", amount: 180000, deadline: "2025-07-01", category: "Idrett", targetGroup: "Idrettslag", description: "Tilskudd til idrettsanlegg", applicationUrl: "https://nif.no" },
    { id: 'g20', name: "Likestillings- og diskrimineringsombudet", organization: "LDO", amount: 120000, deadline: "2025-06-15", category: "Samfunn", targetGroup: "Likestillingsorganisasjoner", description: "Støtte til likestillingsarbeid", applicationUrl: "https://ldo.no" },
    { id: 'g21', name: "SpareBank 1 Stiftelsen", organization: "SpareBank 1", amount: 300000, deadline: "2025-09-30", category: "Samfunn", targetGroup: "Lokalsamfunn", description: "Lokale samfunnstiltak", applicationUrl: "https://sparebank1.no" },
    { id: 'g22', name: "Gjensidige Stiftelsen", organization: "Gjensidige", amount: 400000, deadline: "2025-10-15", category: "Samfunn", targetGroup: "Frivillige organisasjoner", description: "Sosiale formål", applicationUrl: "https://gjensidige.no" },
    { id: 'g23', name: "Landsrådet for Norges barne- og ungdomsorganisasjoner", organization: "LNU", amount: 90000, deadline: "2025-04-30", category: "Barn og ungdom", targetGroup: "Ungdomsorganisasjoner", description: "Barne- og ungdomsarbeid", applicationUrl: "https://lnu.no" },
    { id: 'g24', name: "Norges Røde Kors - Humanitær støtte", organization: "Røde Kors", amount: 200000, deadline: "2025-08-15", category: "Samfunn", targetGroup: "Humanitære organisasjoner", description: "Humanitært arbeid", applicationUrl: "https://rodekors.no" },
    { id: 'g25', name: "Stiftelsen Dam", organization: "Dam Stiftelsen", amount: 500000, deadline: "2025-12-01", category: "Kultur", targetGroup: "Kulturorganisasjoner", description: "Kulturelle formål", applicationUrl: "https://stiftelsen-dam.no" },
    { id: 'g26', name: "Norsk kulturråd - Litteratur", organization: "Kulturrådet", amount: 180000, deadline: "2025-06-20", category: "Kultur", targetGroup: "Forfatterorganisasjoner", description: "Litteraturstøtte", applicationUrl: "https://kulturradet.no" },
    { id: 'g27', name: "Norsk filminstitutt", organization: "NFI", amount: 1200000, deadline: "2025-09-10", category: "Kultur", targetGroup: "Filmprodusenter", description: "Filmstøtte", applicationUrl: "https://nfi.no" },
    { id: 'g28', name: "Raftostiftelsen", organization: "Rafto", amount: 220000, deadline: "2025-07-20", category: "Samfunn", targetGroup: "Menneskerettsorganisasjoner", description: "Menneskerettighetsarbeid", applicationUrl: "https://rafto.no" },
    { id: 'g29', name: "Norsk kulturminneråd", organization: "Kulturminnerådet", amount: 150000, deadline: "2025-05-25", category: "Kultur", targetGroup: "Kulturminneorganisasjoner", description: "Bevaring av kulturminner", applicationUrl: "https://ra.no" },
    { id: 'g30', name: "Fondet for utøvende kunstnere", organization: "Kunstnernett", amount: 95000, deadline: "2025-04-10", category: "Kultur", targetGroup: "Kunstnere", description: "Støtte til utøvende kunst", applicationUrl: "https://kunstnernett.no" }
  ];
}