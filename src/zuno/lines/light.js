/** Personalidade LIGHT: gentil, paciente, professor, encorajador. Nunca constrange. */
import { L } from './line.js';

export default {
  correct: [
    L('Muito bem!', 'Very good!', '¡Muy bien!', 'Molto bene!', 'Très bien !', 'Sehr gut!', 'とてもいいね！', '아주 좋아요!', '很好！'),
    L('Excelente!', 'Excellent!', '¡Excelente!', 'Eccellente!', 'Excellent !', 'Ausgezeichnet!', '素晴らしい！', '훌륭해요!', '太棒了！'),
    L('Boa!', 'Nice!', '¡Bien!', 'Bene!', 'Bien !', 'Gut!', 'いいね！', '좋아요!', '很好！'),
    L('Mandou bem.', 'Well done.', '¡Muy bien!', 'Ben fatto.', 'Bien joué.', 'Gut gemacht.', 'よくできました。', '잘했어요.', '做得好。'),
    L('Acertou.', "That's right.", '¡Correcto!', 'Giusto.', "C'est ça.", 'Richtig.', '正解！', '정답이에요.', '答对了。'),
    L('Essa foi fácil.', 'That was an easy one.', 'Esa fue fácil.', 'Questa era facile.', 'Celle-là était facile.', 'Die war leicht.', '簡単だったね。', '쉬웠죠?', '这个很简单。'),
    L('Agora você entendeu.', "Now you've got it.", 'Ahora lo entendiste.', 'Ora hai capito.', 'Maintenant tu as compris.', "Jetzt hast du's verstanden.", 'わかってきたね。', '이제 이해했네요.', '现在你懂了。'),
    L('Tá pegando o jeito.', "You're getting the hang of it.", 'Le estás agarrando el truco.', 'Ci stai prendendo la mano.', 'Tu prends le coup de main.', 'Du kriegst den Dreh raus.', 'コツをつかんできたね。', '감 잡았네요.', '你找到感觉了。'),
  ],
  proud: [
    L('Sequência perfeita. Estou orgulhoso.', "On a roll. I'm proud of you.", '¡Vas en racha! Estoy orgulloso.', 'Sei in serie! Sono fiero di te.', 'Quelle série ! Je suis fier de toi.', 'Du bist in Fahrt! Ich bin stolz auf dich.', '絶好調！誇らしいよ。', '연속 정답! 자랑스러워요.', '连续答对！我为你骄傲。', { laugh: 'soft' }),
    L('Ninguém te segura.', 'Nothing can stop you.', 'Nadie te para.', 'Nessuno ti ferma.', "Rien ne t'arrête.", 'Dich hält keiner auf.', 'もう止まらないね。', '아무도 못 말려요.', '谁也挡不住你。'),
  ],
  comeback: [
    L('Viu? Você consegue.', 'See? You can do it.', '¿Ves? Tú puedes.', 'Visto? Ce la fai.', 'Tu vois ? Tu peux le faire.', 'Siehst du? Du schaffst das.', 'ほらね、できるでしょ。', '봐요, 할 수 있잖아요.', '你看，你能行。'),
    L('Isso! Recuperou.', 'There you go. Back on track.', '¡Eso! De vuelta al camino.', 'Ecco! Di nuovo in pista.', 'Voilà ! Tu es de retour.', 'Na also! Wieder auf Kurs.', 'そうそう！取り戻したね。', '그렇지! 다시 제자리예요.', '对了！找回状态了。'),
  ],
  wrong1: [
    L('Tente novamente.', 'Try again.', 'Inténtalo de nuevo.', 'Riprova.', 'Réessaie.', 'Versuch es noch einmal.', 'もう一度やってみて。', '다시 해 보세요.', '再试一次。'),
    L('Quase.', 'Almost.', 'Casi.', 'Quasi.', 'Presque.', 'Fast.', 'おしい！', '아깝다!', '差一点。'),
    L('Você estava perto.', 'You were close.', 'Estabas cerca.', 'Eri vicino.', 'Tu étais proche.', 'Du warst nah dran.', '近かったよ。', '거의 맞았어요.', '你很接近了。'),
    L('Olha essa parte com atenção.', 'Look at this part carefully.', 'Mira esta parte con atención.', 'Guarda bene questa parte.', 'Regarde bien cette partie.', 'Schau dir diesen Teil genau an.', 'ここをよく見てね。', '이 부분을 잘 보세요.', '仔细看这一部分。'),
  ],
  wrong2: [
    L('Errou? Tudo bem, vamos recapitular.', "Missed it? That's okay, let's go over it.", '¿Fallaste? Tranquilo, repasemos.', 'Sbagliato? Va bene, ripassiamo.', 'Raté ? Pas grave, on révise.', 'Daneben? Kein Problem, wir wiederholen das.', '間違えた？大丈夫、復習しよう。', '틀렸어요? 괜찮아요, 다시 정리해요.', '错了？没关系，我们复习一下。'),
    L('Vamos tentar mais uma vez.', "Let's try one more time.", 'Intentémoslo otra vez.', 'Proviamo ancora una volta.', 'On réessaie une fois.', 'Versuchen wir es noch einmal.', 'もう一回やってみよう。', '한 번 더 해 봐요.', '我们再试一次。'),
  ],
  wrong3: [
    L('Respira. Uma de cada vez.', 'Breathe. One at a time.', 'Respira. Una a la vez.', 'Respira. Una alla volta.', 'Respire. Une à la fois.', 'Atme durch. Eins nach dem anderen.', '深呼吸。一つずつね。', '숨 한번 쉬어요. 하나씩.', '深呼吸。一个一个来。'),
    L('Vamos devagar. Leia a explicação.', "Let's slow down. Read the explanation.", 'Vamos despacio. Lee la explicación.', 'Andiamo piano. Leggi la spiegazione.', "Doucement. Lis l'explication.", 'Langsam. Lies die Erklärung.', 'ゆっくりいこう。説明を読んでね。', '천천히 해요. 설명을 읽어 보세요.', '慢慢来。看看解释。'),
  ],
  wrong_same: [
    L('Essa de novo. Tudo bem, ela é traiçoeira.', "This one again. It's okay, it's a tricky one.", 'Esta otra vez. Tranquilo, es engañosa.', 'Di nuovo questa. Tranquillo, è insidiosa.', 'Encore celle-là. Pas grave, elle est piégeuse.', 'Die schon wieder. Kein Problem, die ist knifflig.', 'またこれ。大丈夫、ひっかけ問題だから。', '또 이거네요. 괜찮아요, 헷갈리는 문제예요.', '又是这题。没关系，它很容易错。'),
  ],
  idle: [
    L('Tudo bem por aí?', 'Everything okay?', '¿Todo bien?', 'Tutto bene?', 'Tout va bien ?', 'Alles okay?', '大丈夫？', '괜찮아요?', '还好吗？'),
    L('Sem pressa. Estou aqui.', "No rush. I'm here.", 'Sin prisa. Aquí estoy.', 'Nessuna fretta. Sono qui.', 'Pas de stress. Je suis là.', 'Keine Eile. Ich bin da.', '急がなくていいよ。ここにいるから。', '천천히 해요. 여기 있을게요.', '不着急。我在这儿。'),
  ],
  return: [
    L('Você voltou! Senti sua falta.', "You're back! I missed you.", '¡Volviste! Te extrañé.', 'Che bello rivederti!', "Te revoilà ! Tu m'as manqué.", 'Du bist zurück! Ich hab dich vermisst.', 'おかえり！会いたかったよ。', '돌아왔네요! 보고 싶었어요.', '你回来了！我好想你。'),
  ],
  hard_start: [
    L('Modo Difícil. Vai com calma.', 'Hard mode. Take it easy.', 'Modo difícil. Con calma.', 'Modalità difficile. Con calma.', 'Mode difficile. Doucement.', 'Schwerer Modus. Ganz ruhig.', 'ハードモード。落ち着いていこう。', '어려움 모드. 천천히 해요.', '困难模式。别着急。'),
  ],
  complete: [
    L('Boa! Aula concluída.', 'Nice! Lesson complete.', '¡Bien! Lección terminada.', 'Bene! Lezione completata.', 'Bravo ! Leçon terminée.', 'Super! Lektion geschafft.', 'やったね！レッスン完了。', '좋아요! 수업 완료.', '太好了！课程完成。'),
    L('Seu mundo ficou um pouco maior.', 'Your world just got a little bigger.', 'Tu mundo se hizo un poco más grande.', "Il tuo mondo è diventato un po' più grande.", "Ton monde vient de s'agrandir un peu.", 'Deine Welt ist ein bisschen größer geworden.', '君の世界が少し広がったね。', '당신의 세계가 조금 더 넓어졌어요.', '你的世界又变大了一点。'),
  ],
};
