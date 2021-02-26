import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/bitcoin/BitcoinServicesOverviewPage.vue') },
    ],
    beforeEnter: (to, from, next) => {
      next('/payments/overview');
    }
  },
  {
    path: '/welcome',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/welcome/WelcomeToBittery.vue') },
      { path: 'password', component: () => import('pages/welcome/SetupMasterPasswordPage.vue') },
    ],
  },
  {
    path: '/lnd',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'setup', component: () => import('pages/lnd/SetupLndPage.vue') },
      { path: 'setup/existing', component: () => import('pages/lnd/SetupExistingLndPage.vue') },
      { path: 'setup/new', component: () => import('pages/lnd/new/SetupNewLndPage.vue') },
      { path: 'setup/new/customize/:lndType', component: () => import('pages/lnd/new/CustomizeNewLndPage.vue') },
      { path: 'setup/:lndId/init/wallet', component: () => import('pages/lnd/init/InitializeLndWalletPage.vue') },
    ],
  },
  {
    path: '/bitcoin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'overview', component: () => import('pages/bitcoin/BitcoinServicesOverviewPage.vue') },
    ],
  },
  {
    path: '/payments',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'overview', component: () => import('pages/payments/PaymentsOverviewPage.vue') },
      { path: 'setup', component: () => import('pages/payments/SetupPaymentsPage.vue') },
      { path: 'setup/new', component: () => import('pages/payments/SetupNewPaymentsPage.vue') },
      { path: 'pdf/:invoiceId', component: () => import('pages/payments/pdf/InvoicePdf.vue') },
    ],
  },
  {
    path: '/invoices',
    component: () => import('layouts/MainLayoutInformative.vue'),
    children: [
      { path: ':invoiceId', component: () => import('pages/payments/InvoicePayWidgetPage.vue') },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayoutInformative.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') },
    ],
  },
  {
    path: '/register',
    component: () => import('layouts/MainLayoutInformative.vue'),
    children: [
      { path: '', component: () => import('pages/registration/RegisterPage.vue') },
      { path: 'confirm', component: () => import('pages/registration/ConfirmRegistrationPage.vue') },
    ],
  },
  {
    path: '/password',
    component: () => import('layouts/MainLayoutInformative.vue'),
    children: [
      { path: 'reset', component: () => import('pages/password-reset/ResetPasswordPage.vue') },
      { path: 'reset/confirm', component: () => import('pages/password-reset/ConfirmResetPasswordPage.vue') },
    ],
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard/PaymentsDashboardPage.vue') },
    ],
  },
  {
    path: '/integrations',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/integrations/IntegrationsPage.vue') },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
