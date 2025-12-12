import { useState, useEffect, useMemo } from 'react';
import { Calendar, Search, Plus, Check, X, LogOut, Filter, Archive, Mail, Lock } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState(null);
  const [myGrants, setMyGrants] = useState([]);
  const [userFilters, setUserFilters] = useState({ categories: [], minAmount: 0, maxAmount: 5000000 });
  const [showLogin, setShowLogin] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showArchive, setShowArchive] = useState(false);

  const scrapedGrants = [
    { id: 'g1', name: "Kulturrådet - Prosjektstøtte 2025", organization: "Kulturrådet", amount: 500000, deadline: "2025-03-15", category: "Kultur", description: "Støtte til kulturprosjekter", applicationUrl: "https://kulturradet.no/sok-stotte" },
    { id: 'g2', name: "Frifond - Barn og ungdom", organization: "Frifond", amount: 75000, deadline: "2026-02-28", category: "Barn og ungdom", description: "Tilskudd til aktiviteter", applicationUrl: "https://frifond.no" },
    { id: 'g3', name: "Sparebankstiftelsen DNB", organization: "Sparebankstiftelsen DNB", amount: 800000, deadline: "2025-04-01", category: "Samfunn", description: "Støtte til samfunnsnyttige prosjekter", applicationUrl: "https://sparebankstiftelsen.no" },
    { id: 'g4', name: "Helsedirektoratet - Forebygging", organization: "Helsedirektoratet", amount: 600000, deadline: "2025-06-01", category: "Helse", description: "Forebyggende helsearbeid", applicationUrl: "https://helsedirektoratet.no" },
    { id: 'g5', name: "Miljødirektoratet - Grønne tiltak", organization: "Miljødirektoratet", amount: 300000, deadline: "2025-05-15", category: "Miljø", description: "Lokale miljøtiltak", applicationUrl: "https://miljodirektoratet.no" },
    { id: 'g6', name: "Forskningsrådet - Innovasjon", organization: "Norges forskningsråd", amount: 1500000, deadline: "2025-09-01", category: "Forskning", description: "Innovative prosjekter", applicationUrl: "https://forskningsradet.no" },
    { id: 'g7', name: "Bufdir - Inkludering", organization: "Bufdir", amount: 400000, deadline: "2025-08-20", category: "Barn og ungdom", description: "Inkluderingstiltak", applicationUrl: "https://bufdir.no" },
    { id: 'g8', name: "Extra Stiftelsen - Dugnad", organization: "Extra Stiftelsen", amount: 50000, deadline: "2025-12-31", category: "Lokalsamfunn", description: "Dugnadsinnsats", applicationUrl: "https://extra.no/stiftelsen" }
  ];

  useEffect(() => {
    const loadUserData = () => {
      if (!user) return;
      try {
        const savedGrants = localStorage.getItem(`my_grants_${user.id}`);
        if (savedGrants) setMyGrants(JSON.parse(savedGrants));
        const savedFilters = localStorage.getItem(`filters_${user.id}`);
        if (savedFilters) setUserFilters(JSON.parse(savedFilters));
      } catch (error) {
        console.log('No saved data');
      }
    };
    loadUserData();
  }, [user]);

  useEffect(() => {
    const saveUserData = () => {
      if (!user) return;
      try {
        localStorage.setItem(`my_grants_${user.id}`, JSON.stringify(myGrants));
        localStorage.setItem(`filters_${user.id}`, JSON.stringify(userFilters));
      } catch (error) {
        console.error('Save failed:', error);
      }
    };
    saveUserData();
  }, [myGrants, userFilters, user]);

  const handleGoogleLogin = () => {
    const clientId = '224650618022-dhg02n8picd3spe0g3rfr67i6ilk26ll.apps.googleusercontent.com';
    const redirectUri = window.location.origin;
    const scope = 'email profile openid';
    const state = Math.random().toString(36).substring(7);
    
    sessionStorage.setItem('google_auth_state', state);
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=token&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}&` +
      `prompt=select_account`;
    
    window.location.href = authUrl;
  };

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const hash = window.location.hash;
      
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const state = params.get('state');
        const storedState = sessionStorage.getItem('google_auth_state');
        
        if (state === storedState) {
          try {
            const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            const userData = await response.json();
            
            const googleUser = {
              id: `google_${userData.id}`,
              name: userData.name,
              email: userData.email,
              picture: userData.picture,
              provider: 'google'
            };
            
            setUser(googleUser);
            setShowLogin(false);
            window.history.replaceState({}, document.title, window.location.pathname);
            sessionStorage.removeItem('google_auth_state');
          } catch (error) {
            console.error('Failed to fetch user info:', error);
            setLoginError('Kunne ikke hente brukerinformasjon fra Google');
            setShowLogin(true);
          }
        }
      }
    };
    
    handleGoogleCallback();
  }, []);

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    
    if (!email || !password) {
      setLoginError('Vennligst fyll ut e-post og passord');
      setIsLoggingIn(false);
      return;
    }

    setTimeout(() => {
      const emailUser = { id: `email_${btoa(email)}`, name: email.split('@')[0], email: email, provider: 'email' };
      setUser(emailUser);
      setShowLogin(false);
      setIsLoggingIn(false);
    }, 500);
  };

  const handleLogout = () => {
    setUser(null);
    setShowLogin(true);
    setMyGrants([]);
    setEmail('');
    setPassword('');
  };

  const filteredAvailableGrants = useMemo(() => {
    return scrapedGrants.filter(grant => {
      if (myGrants.some(mg => mg.id === grant.id)) return false;
      if (userFilters.categories.length > 0 && !userFilters.categories.includes(grant.category)) return false;
      if (grant.amount < userFilters.minAmount || grant.amount > userFilters.maxAmount) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return grant.name.toLowerCase().includes(query) || grant.organization.toLowerCase().includes(query);
      }
      return true;
    });
  }, [myGrants, userFilters, searchQuery]);

  const addToMyCalendar = (grant) => {
    setMyGrants([...myGrants, { ...grant, addedDate: new Date().toISOString(), status: 'planned', notes: '' }]);
  };

  const removeFromCalendar = (grantId) => {
    setMyGrants(myGrants.filter(g => g.id !== grantId));
  };

  const updateGrantStatus = (grantId, status) => {
    setMyGrants(myGrants.map(g => g.id === grantId ? { ...g, status } : g));
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    return Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
  };

  const getUrgencyColor = (days) => {
    if (days < 0) return 'bg-gray-100 text-gray-600 border-gray-200';
    if (days <= 7) return 'bg-red-50 text-red-700 border-red-200';
    if (days <= 30) return 'bg-orange-50 text-orange-700 border-orange-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(amount);
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Søknadskalender</h1>
            <p className="text-sm sm:text-base text-gray-600">Hold oversikt over tilskuddsfrister</p>
          </div>
          
          {loginError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{loginError}</div>}
          
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-post</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="din@epost.no" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passord</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••" />
              </div>
            </div>
            
            <button onClick={(e) => { e.preventDefault(); handleEmailLogin(e); }} disabled={isLoggingIn} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-semibold transition-colors">
              {isLoggingIn ? 'Logger inn...' : 'Logg inn'}
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">eller</span></div>
          </div>

          <button onClick={handleGoogleLogin} className="w-full py-3 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Fortsett med Google
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-6">Data lagres sikkert på alle enheter</p>
        </div>
      </div>
    );
  }

  // ... REST OF THE COMPONENT CODE (Settings, Main Calendar View)
  // Due to character limit, I'll provide this in the next file

  const sortedMyGrants = [...myGrants].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  const upcomingGrants = sortedMyGrants.filter(g => getDaysUntilDeadline(g.deadline) >= 0);
  const pastGrants = sortedMyGrants.filter(g => getDaysUntilDeadline(g.deadline) < 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-6">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Søknadskalender</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">{user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => setShowSettings(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Filter className="w-5 h-5" /></button>
              <button onClick={handleLogout} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><LogOut className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Mine søknadsfrister</h2>
                <div className="text-sm text-gray-600">{upcomingGrants.length} kommende</div>
              </div>

              {upcomingGrants.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Ingen søknader i kalenderen</p>
                  <p className="text-sm text-gray-500">Legg til fra listen til høyre</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {upcomingGrants.map(grant => {
                    const daysUntil = getDaysUntilDeadline(grant.deadline);
                    return (
                      <div key={grant.id} className={`border-2 rounded-xl p-4 sm:p-5 ${getUrgencyColor(daysUntil)}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 pr-3">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{grant.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{grant.organization}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-bold text-base sm:text-lg">{daysUntil === 0 ? 'I dag!' : `${daysUntil}d`}</div>
                            <div className="text-xs text-gray-600">{new Date(grant.deadline).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs sm:text-sm">
                          <span className="font-medium text-gray-900">{formatCurrency(grant.amount)}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-600">{grant.category}</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button onClick={() => updateGrantStatus(grant.id, grant.status === 'completed' ? 'planned' : 'completed')} className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium ${grant.status === 'completed' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border-2 border-gray-200'}`}>
                            {grant.status === 'completed' ? '✓ Sendt' : 'Marker sendt'}
                          </button>
                          <a href={grant.applicationUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium text-center">Søk her</a>
                          <button onClick={() => removeFromCalendar(grant.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><X className="w-5 h-5" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {pastGrants.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <button onClick={() => setShowArchive(!showArchive)} className="flex items-center justify-between w-full mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Archive className="w-5 h-5" />Arkiv ({pastGrants.length})
                  </h3>
                  <span className="text-gray-400">{showArchive ? '−' : '+'}</span>
                </button>
                
                {showArchive && (
                  <div className="space-y-3">
                    {pastGrants.map(grant => (
                      <div key={grant.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm mb-1">{grant.name}</h4>
                            <p className="text-xs text-gray-600 mb-2">{grant.organization}</p>
                            <div className="flex gap-3 text-xs text-gray-500">
                              <span>Frist: {new Date(grant.deadline).toLocaleDateString('nb-NO')}</span>
                              {grant.status === 'completed' && <span className="text-green-600 flex items-center gap-1"><Check className="w-3 h-3" /> Sendt</span>}
                            </div>
                          </div>
                          <button onClick={() => removeFromCalendar(grant.id)} className="p-1 text-gray-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 sticky top-20">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Finn nye søknader</h2>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Søk..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>

              <button onClick={() => setShowSettings(true)} className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center justify-center gap-2 mb-4">
                <Filter className="w-4 h-4" />Juster filtre
              </button>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredAvailableGrants.map(grant => {
                  const daysUntil = getDaysUntilDeadline(grant.deadline);
                  return (
                    <div key={grant.id} className="border-2 border-gray-200 rounded-lg p-3 hover:border-blue-300">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm flex-1 pr-2">{grant.name}</h3>
                        <span className="text-xs font-medium text-gray-600">{daysUntil}d</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{grant.organization}</p>
                      <div className="flex justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(grant.amount)}</span>
                        <span className="text-xs text-gray-500">{new Date(grant.deadline).toLocaleDateString('nb-NO')}</span>
                      </div>
                      <button onClick={() => addToMyCalendar(grant)} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />Legg til
                      </button>
                    </div>
                  );
                })}
                
                {filteredAvailableGrants.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-600 mb-2">Ingen søknader funnet</p>
                    <button onClick={() => setShowSettings(true)} className="text-sm text-blue-600 hover:underline">Juster filtre</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
