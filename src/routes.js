/**
 * Mapa de rotas. Para adicionar uma tela: crie em pages/ e registre aqui.
 * layout: 'auth' (entrada) | 'app' (com navegação) | 'focus' (aula, sem distrações)
 * nav: qual item do menu fica ativo
 */
import { LoginPage } from './pages/auth/LoginPage.js';
import { SignupPage } from './pages/auth/SignupPage.js';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage.js';
import { HomePage } from './pages/app/HomePage.js';
import { LearnPage } from './pages/app/LearnPage.js';
import { LanguagePage } from './pages/app/LanguagePage.js';
import { LessonPage, HardLessonPage, ReviewPage } from './pages/app/LessonPage.js';
import { PlusPage } from './pages/app/PlusPage.js';
import { WorldPage } from './pages/app/WorldPage.js';
import { ConversationSetupPage } from './pages/app/ConversationSetupPage.js';
import { ChatPage, ScenePage, ResumePage } from './pages/app/ConversationPage.js';
import { WritingPage } from './pages/app/WritingPage.js';
import { PronunciationPage } from './pages/app/PronunciationPage.js';
import { OnboardingPage, LevelTestPage } from './pages/app/OnboardingPage.js';
import { ProgressPage } from './pages/app/ProgressPage.js';
import { ProfilePage } from './pages/app/ProfilePage.js';

export const ROUTES = [
  { path: 'login', title: 'Entrar', layout: 'auth', access: 'guest', page: LoginPage },
  { path: 'cadastro', title: 'Criar conta', layout: 'auth', access: 'guest', page: SignupPage, compactZuno: true },
  { path: 'recuperar', title: 'Recuperar senha', layout: 'auth', access: 'guest', page: ForgotPasswordPage, compactZuno: true },

  { path: 'comecar', title: 'Seu ponto de partida', layout: 'focus', access: 'private', page: OnboardingPage, onboarding: true },
  { path: 'nivel', pattern: /^nivel-([a-z]{2})$/, title: 'Teste de nível', layout: 'focus', access: 'private', page: LevelTestPage },
  { path: 'inicio', title: 'Início', layout: 'app', access: 'private', page: HomePage, nav: 'inicio' },
  { path: 'aprender', title: 'Aprender', layout: 'app', access: 'private', page: LearnPage, nav: 'aprender' },
  { path: 'idioma', pattern: /^idioma-([a-z]{2})$/, title: 'Idioma', layout: 'app', access: 'private', page: LanguagePage, nav: 'aprender' },
  { path: 'aula', pattern: /^aula-([a-z0-9-]+)$/, title: 'Aula', layout: 'focus', access: 'private', page: LessonPage },
  { path: 'dificil', pattern: /^dificil-([a-z0-9-]+)$/, title: 'Modo Difícil', layout: 'focus', access: 'private', page: HardLessonPage },
  { path: 'revisao', pattern: /^revisao-([a-z]{2})$/, title: 'Revisão', layout: 'focus', access: 'private', page: ReviewPage },
  { path: 'plus', title: 'Zuno Plus', layout: 'app', access: 'private', page: PlusPage, nav: 'perfil' },
  { path: 'mundo', title: 'Modo Mundo', layout: 'app', access: 'private', page: WorldPage, nav: 'mundo' },
  { path: 'conversar', title: 'Conversar com Zuno', layout: 'app', access: 'private', page: ConversationSetupPage, nav: 'mundo' },
  { path: 'conversa', pattern: /^conversa-([a-z]{2})-(a1|a2|b1|b2|c1|c2)-([a-z]+)$/, title: 'Conversa', layout: 'focus', access: 'private', page: ChatPage },
  { path: 'cena', pattern: /^cena-([a-z]{2})-([a-z]+)$/, title: 'Modo Mundo', layout: 'focus', access: 'private', page: ScenePage },
  { path: 'sessao', pattern: /^sessao-([a-z0-9]+)$/, title: 'Conversa', layout: 'focus', access: 'private', page: ResumePage },
  { path: 'escrever', title: 'Escreva em outro idioma', layout: 'focus', access: 'private', page: WritingPage },
  { path: 'pronuncia', pattern: /^pronuncia-([a-z]{2})$/, title: 'Pronúncia', layout: 'focus', access: 'private', page: PronunciationPage },
  { path: 'progresso', title: 'Progresso', layout: 'app', access: 'private', page: ProgressPage, nav: 'progresso' },
  { path: 'perfil', title: 'Perfil', layout: 'app', access: 'private', page: ProfilePage, nav: 'perfil' },
];

export const DEFAULT_GUEST = 'login';
export const DEFAULT_PRIVATE = 'inicio';
