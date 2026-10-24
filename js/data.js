/* Sample data for the static prototype. Nothing here is real. */
window.DBT_DATA = (function () {
  var TODAY = '2026-10-23';

  var COMPANIES = {
    c1: { id: 'c1', name: 'Company 1', exch: 'XETRA', code: 'C1', price: 0.842, vol30: 184200, spread30: 14.2, trades30: 1284, value30: '€2.84M',
      feed: ['ok', 'Up to date'], last: '23 Oct · 14:32 UTC', timTarget: 85, sprTarget: 20, fee: 4800,
      legal: 'Company 1 AG', shares: '120,000,000', float: '85,000,000', insiders: '12%', institutions: '48%',
      email: 'ir@company1.example', phone: '+49 69 000 1000', address: 'Hauptstrasse 1, 60311 Frankfurt, Germany' },
    c2: { id: 'c2', name: 'Company 2', exch: 'Euronext', code: 'C2', price: 1.264, vol30: 212840, spread30: 17.8, trades30: 1486, value30: '€3.91M',
      feed: ['warn', 'Delayed 2h'], last: '23 Oct · 12:18 UTC', timTarget: 85, sprTarget: 18, fee: 6400,
      legal: 'Company 2 N.V.', shares: '96,500,000', float: '61,200,000', insiders: '9%', institutions: '55%',
      email: 'investors@company2.example', phone: '+31 20 000 2000', address: 'Damrak 20, 1012 Amsterdam, Netherlands' },
    elite: { id: 'elite', name: 'elite', exch: 'XETRA', code: 'ELT', price: 2.108, vol30: 85560, spread30: 12.6, trades30: 612, value30: '€1.74M',
      feed: ['ok', 'Up to date'], last: '23 Oct · 14:29 UTC', timTarget: 85, sprTarget: 16, fee: 5600,
      legal: 'elite Holding SE', shares: '48,000,000', float: '30,400,000', insiders: '21%', institutions: '40%',
      email: 'ir@elite.example', phone: '+49 89 000 3000', address: 'Maximilianstrasse 8, 80539 Munich, Germany' }
  };
  var ORDER = ['c1', 'c2', 'elite'];

  /* KPI per company and period. tim = time in market %, spr = avg spread bps, vol = shares, turn = turnover %, share = Deltablock share of volume % */
  var KPI = {
    c1: {
      '24h': { tim: 96.0, timD: 2.1, vol: 11400, volD: 8.4, spr: 14.8, sprD: -0.2, turn: 0.05, turnD: 0.01, share: 6.8, traders: 4 },
      '7d': { tim: 95.2, timD: 0.8, vol: 48900, volD: 3.1, spr: 14.5, sprD: -0.4, turn: 0.21, turnD: 0.02, share: 6.5, traders: 5 },
      '30d': { tim: 96.0, timD: 1.4, vol: 184200, volD: 5.2, spr: 14.2, sprD: -0.6, turn: 0.84, turnD: 0.06, share: 6.3, traders: 5 },
      since: { tim: 94.1, vol: 1398000, spr: 15.1, turn: 6.2, share: 6.1, traders: 5 }
    },
    c2: {
      '24h': { tim: 79.6, timD: -3.2, vol: 14100, volD: -6.5, spr: 19.4, sprD: 1.1, turn: 0.04, turnD: -0.01, share: 9.4, traders: 3 },
      '7d': { tim: 81.0, timD: -1.5, vol: 60300, volD: -2.2, spr: 18.6, sprD: 0.5, turn: 0.18, turnD: -0.02, share: 9.6, traders: 4 },
      '30d': { tim: 82.1, timD: 0.4, vol: 212840, volD: 1.9, spr: 17.8, sprD: -0.3, turn: 0.64, turnD: 0.03, share: 9.1, traders: 4 },
      since: { tim: 80.7, vol: 1612000, spr: 18.9, turn: 5.1, share: 8.7, traders: 4 }
    },
    elite: {
      '24h': { tim: 98.1, timD: 0.6, vol: 5300, volD: 12.0, spr: 12.9, sprD: -0.5, turn: 0.07, turnD: 0.01, share: 4.2, traders: 2 },
      '7d': { tim: 97.6, timD: 0.2, vol: 21800, volD: 7.4, spr: 12.7, sprD: -0.3, turn: 0.29, turnD: 0.04, share: 4.4, traders: 3 },
      '30d': { tim: 97.3, timD: 0.9, vol: 85560, volD: 9.7, spr: 12.6, sprD: -0.8, turn: 1.02, turnD: 0.12, share: 4.6, traders: 3 },
      since: { tim: 96.4, vol: 612000, spr: 13.4, turn: 7.8, share: 5.0, traders: 3 }
    }
  };

  /* Anonymised peer groups. Order of measures: volume, spread (bps), time in market (%), turnover (%). */
  var PEER_GROUPS = [
    { id: 'ind', name: 'European industrials', n: 8, median: [162400, 18.6, 82.4, 0.72], range: ['92k \u2013 281k', '11.4 \u2013 31.2', '61% \u2013 98%', '0.31% \u2013 1.4%'] },
    { id: 'cap', name: 'Companies with similar market cap', n: 12, median: [148000, 16.9, 86.1, 0.66], range: ['70k \u2013 240k', '10.2 \u2013 26.8', '66% \u2013 99%', '0.28% \u2013 1.2%'] },
    { id: 'all', name: 'All listed peers', n: 46, median: [121500, 21.3, 78.9, 0.58], range: ['18k \u2013 410k', '8.9 \u2013 44.0', '42% \u2013 99%', '0.09% \u2013 1.9%'] }
  ];

  var SUB = {
    c1: { plan: 'Liquidity Essentials', term: 'Annual service', start: '01 Mar 2026', end: '28 Feb 2027', renewal: '01 Mar 2027', renewIso: '2027-03-01', status: ['ok', 'Active'],
      services: [['Liquidity monitoring', 'Daily coverage'], ['Investor reporting', 'Monthly'], ['Trade history', 'Full access']],
      doc: ['Liquidity services agreement.pdf', 'Signed 01 Mar 2026 · 2.4 MB'] },
    c2: { plan: 'Liquidity Plus', term: 'Annual service', start: '15 Nov 2025', end: '14 Nov 2026', renewal: '15 Nov 2026', renewIso: '2026-11-15', status: ['warn', 'Renews soon'],
      services: [['Liquidity monitoring', 'Intraday coverage'], ['Investor reporting', 'Monthly + quarterly'], ['Trade history', 'Full access'], ['Peer comparison', 'Full access']],
      doc: ['Liquidity services agreement Plus.pdf', 'Signed 15 Nov 2025 · 2.6 MB'] },
    elite: { plan: 'Investor Relations', term: 'Annual service', start: '01 Jul 2026', end: '30 Jun 2027', renewal: '30 Jun 2027', renewIso: '2027-06-30', status: ['ok', 'Active'],
      services: [['Liquidity monitoring', 'Daily coverage'], ['Investor reporting', 'Monthly'], ['Peer comparison', 'Full access'], ['Shareholder analysis', 'Quarterly']],
      doc: ['Investor relations agreement.pdf', 'Signed 01 Jul 2026 · 2.5 MB'] }
  };

  var REPORTS = [
    ['Monthly liquidity review', 'September 2026', '04 Oct 2026', 'reports/monthly-liquidity-review.pdf'],
    ['Trading activity summary', 'Q3 2026', '02 Oct 2026', 'reports/trading-activity-summary.pdf'],
    ['Annual market review', '2025', '12 Jan 2026', 'reports/annual-market-review.pdf']
  ];

  /* Admin-created sign-up links. status: unused | used | expired */
  var LINKS = [
    { id: 'L5', token: 'tomas-b7k2', name: 'Tomas Berg', email: 'tomas@berg.example', companies: ['c2', 'elite'], created: '20 Oct 2026', expires: '03 Nov 2026', status: 'unused' },
    { id: 'L4', token: 'sara-x91q', name: 'Sara Malik', email: 'sara.m@gmail.com', companies: ['c2'], created: '28 Sep 2026', expires: '12 Oct 2026', status: 'expired' },
    { id: 'L3', token: 'diego-m4n8', name: 'Diego Alvarez', email: 'diego@acme.co', companies: ['c1', 'c2', 'elite'], created: '21 Sep 2026', expires: '05 Oct 2026', status: 'used', usedOn: '22 Sep 2026' },
    { id: 'L2', token: 'omar-77aa', name: 'Omar Siddiqui', email: 'omar@elite.com', companies: ['elite'], created: '14 Sep 2026', expires: '28 Sep 2026', status: 'used', usedOn: '14 Sep 2026' },
    { id: 'L1', token: 'aisha-12cc', name: 'Aisha Khan', email: 'aisha.khan@gmail.com', companies: ['c1'], created: '02 Sep 2026', expires: '16 Sep 2026', status: 'used', usedOn: '03 Sep 2026' }
  ];

  var REQUESTS = [
    { id: 'R4', name: 'Priya Nair', email: 'priya.nair@helios-power.example', company: 'Helios Power AG', message: 'We are listed on XETRA and would like to see liquidity reporting for our shares.', date: '21 Oct 2026', status: 'pending' },
    { id: 'R3', name: 'Marc Dubois', email: 'm.dubois@nordvik.example', company: 'Nordvik Industries', message: 'Interested in peer comparison against European industrials.', date: '20 Oct 2026', status: 'pending' },
    { id: 'R2', name: 'Hanna Weber', email: 'hanna@weber-capital.example', company: 'Weber Capital', message: 'Please share pricing for the investor relations plan.', date: '15 Oct 2026', status: 'approved' },
    { id: 'R1', name: 'Chris Walker', email: 'chris@walker-media.example', company: 'Walker Media', message: 'Looking for market data for a news article.', date: '09 Oct 2026', status: 'rejected' }
  ];

  /* Everyone with an account (or a pending invitation). type: admin | client | colleague | guest */
  var PEOPLE = [
    { id: 'p1', name: 'Khan Abid', email: 'khan@gmail.com', type: 'admin', companies: [], status: 'active' },
    { id: 'p2', name: 'Xavier Young', email: 'xy@gmail.com', type: 'admin', companies: [], status: 'active' },
    { id: 'p3', name: 'Aisha Khan', email: 'aisha.khan@gmail.com', type: 'client', owner: true, companies: ['c1'], tenant: 'aisha.khan@gmail.com', status: 'active', via: 'Sign-up link' },
    { id: 'p4', name: 'Mia Fischer', email: 'mia.fischer@company1.example', type: 'colleague', companies: ['c1'], tenant: 'aisha.khan@gmail.com', status: 'active', via: 'Team invite', invitedBy: 'Aisha Khan' },
    { id: 'p5', name: 'Lena Brandt', email: 'lena@brandt.io', type: 'colleague', companies: ['c1'], tenant: 'aisha.khan@gmail.com', status: 'pending', via: 'Team invite', invitedBy: 'Aisha Khan', token: 'colleague-lena-9x2m' },
    { id: 'p6', name: 'Jordan Lee', email: 'jordan@example.com', type: 'guest', companies: ['c1'], tenant: 'aisha.khan@gmail.com', status: 'pending', via: 'Team invite', invitedBy: 'Aisha Khan', token: 'guest-jordan-7f3k' },
    { id: 'p7', name: 'Omar Siddiqui', email: 'omar@elite.com', type: 'client', owner: true, companies: ['elite'], tenant: 'omar@elite.com', status: 'active', via: 'Sign-up link' },
    { id: 'p8', name: 'Diego Alvarez', email: 'diego@acme.co', type: 'client', owner: true, companies: ['c1', 'c2', 'elite'], tenant: 'diego@acme.co', status: 'active', via: 'Sign-up link' },
    { id: 'p9', name: 'Priya Shah', email: 'priya.shah@acme.co', type: 'colleague', companies: ['c2', 'elite'], tenant: 'diego@acme.co', status: 'active', via: 'Team invite', invitedBy: 'Diego Alvarez' },
    { id: 'p10', name: 'Marco Rossi', email: 'marco@rossi-advisory.example', type: 'guest', companies: ['c2'], tenant: 'diego@acme.co', status: 'active', via: 'Team invite', invitedBy: 'Diego Alvarez' },
    { id: 'p11', name: 'Sara Malik', email: 'sara.m@gmail.com', type: 'client', owner: true, companies: ['c2'], tenant: 'sara.m@gmail.com', status: 'pending', via: 'Sign-up link (expired)' }
  ];

  var TICKETS = [
    { id: 'DB-1052', subject: 'Add a custom peer group', company: 'c1', by: 'Aisha Khan', status: 'await', created: '21 Oct 2026', updated: 'Yesterday', messages: [
      { from: 'client', name: 'Aisha Khan', at: '21 Oct · 10:05', text: 'Could we compare Company 1 against three named competitors instead of the standard industrials group?' },
      { from: 'support', name: 'Mara · Deltablock support', at: '21 Oct · 15:40', text: 'Named peers are not possible because peer data is anonymised, but we can build a custom group by sector and market cap. Which size range would you like?' } ] },
    { id: 'DB-1048', subject: 'September report clarification', company: 'c1', by: 'Aisha Khan', status: 'prog', created: '19 Oct 2026', updated: 'Today, 09:42', messages: [
      { from: 'client', name: 'Aisha Khan', at: '19 Oct · 16:12', text: 'The September report shows turnover of 0.84%, but the overview shows 0.05% for the last 24 hours. Which period does the report use?' },
      { from: 'support', name: 'Mara · Deltablock support', at: '20 Oct · 09:30', text: 'The report uses the full calendar month, the overview uses the last 24 hours. We are adding the period to the report footer.' },
      { from: 'client', name: 'Aisha Khan', at: '20 Oct · 11:02', text: 'Thanks. Can you also confirm that time in market uses the same calendar month?' },
      { from: 'support', name: 'Mara · Deltablock support', at: 'Today · 09:42', text: 'Confirmed, both use the calendar month. I will send the updated PDF shortly.' } ] },
    { id: 'DB-1039', subject: 'Exchange data delay', company: 'c2', by: 'Diego Alvarez', status: 'await', created: '17 Oct 2026', updated: 'Yesterday', messages: [
      { from: 'client', name: 'Diego Alvarez', at: '17 Oct · 08:50', text: 'The Company 2 trade feed looks about two hours behind. Is this on your side or the exchange?' },
      { from: 'support', name: 'Mara · Deltablock support', at: '21 Oct · 14:10', text: 'The delay comes from the Euronext delivery. It is catching up. Could you tell us if you still see gaps after 18:00 UTC?' } ] },
    { id: 'DB-0982', subject: 'Invoice DB-2026-007', company: 'c1', by: 'Aisha Khan', status: 'done', created: '15 Sep 2026', updated: '18 Sep 2026', messages: [
      { from: 'client', name: 'Aisha Khan', at: '15 Sep · 09:15', text: 'Please resend invoice DB-2026-007, it did not reach our accounting inbox.' },
      { from: 'support', name: 'Mara · Deltablock support', at: '18 Sep · 10:20', text: 'Resent to accounting@company1.example. You can also download it under Statements.' } ] }
  ];

  var ACCESS_LOG = [
    ['Khan', 'Abid', 'khan@gmail.com', 'Admin'], ['Aisha', 'Khan', 'aisha.khan@gmail.com', 'Company 1'], ['Omar', 'Siddiqui', 'omar@elite.com', 'elite'],
    ['Diego', 'Alvarez', 'diego@acme.co', 'Company 2'], ['Mia', 'Fischer', 'mia.fischer@company1.example', 'Company 1'], ['Priya', 'Shah', 'priya.shah@acme.co', 'Company 2'],
    ['Xavier', 'Young', 'xy@gmail.com', 'Admin'], ['Marco', 'Rossi', 'marco@rossi-advisory.example', 'Company 2'], ['Diego', 'Alvarez', 'diego@acme.co', 'elite'], ['Aisha', 'Khan', 'aisha.khan@gmail.com', 'Company 1']
  ];

  var FEEDS = [
    ['c1', 'Trades', '23 Oct · 14:32 UTC', '15 min', '1,284', ['ok', 'Up to date']],
    ['c1', 'Reference prices', '23 Oct · 14:30 UTC', '15 min', '412', ['ok', 'Up to date']],
    ['c2', 'Trades', '23 Oct · 12:18 UTC', '15 min', '986', ['warn', 'Delayed']],
    ['c2', 'Reference prices', '23 Oct · 14:28 UTC', '15 min', '398', ['ok', 'Up to date']],
    ['elite', 'Trades', '23 Oct · 14:29 UTC', '15 min', '756', ['ok', 'Up to date']],
    ['elite', 'Reference prices', '23 Oct · 14:31 UTC', '15 min', '240', ['ok', 'Up to date']]
  ];

  return { TODAY: TODAY, COMPANIES: COMPANIES, ORDER: ORDER, KPI: KPI, PEER_GROUPS: PEER_GROUPS, SUB: SUB, REPORTS: REPORTS, LINKS: LINKS, REQUESTS: REQUESTS,
    PEOPLE: PEOPLE, TICKETS: TICKETS, ACCESS_LOG: ACCESS_LOG, FEEDS: FEEDS };
})();
