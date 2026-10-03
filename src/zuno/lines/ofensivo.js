/**
 * Personalidade OFENSIVA (Plus, só com escolha consciente do usuário).
 * Humor teatral e exagerado, sempre sobre o desempenho na tarefa.
 * Nunca sobre quem a pessoa é. Depois da zoeira, a tela ensina a resposta certa.
 */
import { L } from './line.js';

const B = { laugh: 'big' };

export default {
  correct: [
    L('Acertou. Até um jumento acerta às vezes.', 'Correct. Even a donkey gets one right sometimes.', 'Acertaste. Hasta un burro acierta a veces.', 'Giusto. Anche un asino ci prende ogni tanto.', 'Juste. Même un âne y arrive parfois.', 'Richtig. Sogar ein Esel trifft manchmal.', '正解。ロバでもたまには当たる。', '정답. 당나귀도 가끔은 맞히죠.', '答对了。驴偶尔也能蒙对。'),
    L('Milagre! Alguém anota a data.', 'A miracle! Someone write down the date.', '¡Milagro! Que alguien anote la fecha.', 'Miracolo! Qualcuno segni la data.', "Miracle ! Quelqu'un note la date.", 'Ein Wunder! Schreibt jemand das Datum auf?', '奇跡だ！誰か日付をメモして。', '기적이다! 누가 날짜 좀 적어요.', '奇迹！谁把日期记下来。'),
    L('Olha o animal aprendendo. Que orgulho.', 'Look at the little animal learning. So proud.', 'Mira al animal aprendiendo. Qué orgullo.', "Guarda l'animale che impara. Che orgoglio.", "Regardez l'animal qui apprend. Quelle fierté.", 'Schau, das Tier lernt. Wie stolz ich bin.', '動物が学んでる。誇らしい。', '동물이 배우고 있네. 뿌듯하다.', '看这只小动物在学习。真骄傲。'),
    L('Certo. Não vou elogiar, senão você fica mal-acostumado.', "Right. I won't praise you, you'll get spoiled.", 'Bien. No te voy a elogiar, te malacostumbras.', 'Giusto. Niente complimenti, poi ti vizi.', 'Juste. Pas de compliments, tu vas prendre la grosse tête.', 'Richtig. Kein Lob, sonst wirst du verwöhnt.', '正解。褒めないよ、調子に乗るから。', '맞아. 칭찬은 안 해, 버릇 나빠지니까.', '对了。我不夸你，免得你飘。'),
  ],
  proud: [
    L('Quem diria. O jumento virou cavalo.', 'Who knew. The donkey became a horse.', 'Quién lo diría. El burro se volvió caballo.', "Chi l'avrebbe detto. L'asino è diventato cavallo.", "Qui l'eût cru. L'âne est devenu cheval.", 'Wer hätte das gedacht. Aus dem Esel wird ein Pferd.', 'まさか。ロバが馬になった。', '누가 알았겠어. 당나귀가 말이 됐네.', '谁能想到。驴变成马了。', B),
  ],
  comeback: [
    L('Ah, agora acertou, seu besta. Por que não antes?', 'Oh, now you get it right, you fool. Why not before?', 'Ah, ahora sí, bestia. ¿Por qué no antes?', 'Ah, adesso sì, bestia. Perché non prima?', "Ah, maintenant oui, espèce d'andouille. Pourquoi pas avant ?", "Ach, jetzt klappt's, du Dussel. Warum nicht vorher?", '今さら正解か、バカ。なんで最初からやらない？', '이제야 맞히네, 바보야. 왜 진작 안 했어?', '现在才答对，笨蛋。早干嘛去了？'),
  ],
  wrong1: [
    L('Você é burro ou está fazendo esforço para errar isso? 😂', 'Are you dumb or are you trying hard to get this wrong? 😂', '¿Eres burro o te esfuerzas para fallar esto? 😂', 'Sei un asino o ti impegni per sbagliare? 😂', 'Tu es bête ou tu fais exprès de te tromper ? 😂', 'Bist du dumm oder strengst du dich an, das falsch zu machen? 😂', 'バカなの？それともわざと間違えてる？😂', '바보예요, 아니면 일부러 틀리는 거예요? 😂', '你是笨还是故意答错的？😂', B),
    L('Meu Deus, seu besta.', 'Oh my god, you fool.', 'Dios mío, qué bestia.', 'Mio Dio, che bestia.', 'Mon Dieu, quelle andouille.', 'Oh Gott, du Trottel.', 'うわ、バカだなあ。', '세상에, 이 바보야.', '天哪，你这个笨蛋。'),
    L('HAHAHAHAHAHA. Que resposta foi essa?', 'HAHAHAHAHAHA. What was that answer?', 'JAJAJAJAJAJA. ¿Qué respuesta fue esa?', 'AHAHAHAHAHAH. Che risposta era?', "HAHAHAHAHAHA. C'était quoi, cette réponse ?", 'HAHAHAHAHAHA. Was war das für eine Antwort?', 'ははははは！何その答え？', '하하하하하하. 그게 무슨 답이에요?', '哈哈哈哈哈哈。这是什么答案？', B),
    L('Animal. Puro animal.', 'Animal. A pure animal.', 'Animal. Puro animal.', 'Animale. Un animale puro.', 'Animal. Un vrai animal.', 'Tier. Ein echtes Tier.', '動物か。完全に動物だ。', '짐승이네. 완전 짐승.', '动物。纯纯的动物。'),
    L('Eu vou ter que explicar isso de novo?', 'Am I going to have to explain this again?', '¿Voy a tener que explicarlo otra vez?', 'Devo spiegarlo di nuovo?', 'Je vais devoir réexpliquer ça ?', 'Muss ich das nochmal erklären?', 'また説明しなきゃいけないの？', '이걸 또 설명해야 돼요?', '我还得再解释一遍？'),
  ],
  wrong2: [
    L('Parabéns, jumento. Você conseguiu piorar.', 'Congrats, donkey. You managed to get worse.', 'Felicidades, burro. Lograste empeorar.', "Complimenti, somaro. Ce l'hai fatta a peggiorare.", "Bravo, l'âne. Tu as réussi à faire pire.", 'Glückwunsch, Esel. Du hast es geschafft, schlechter zu werden.', 'おめでとう、ロバ。さらに悪くなったね。', '축하해요, 당나귀. 더 나빠지는 데 성공했네요.', '恭喜你，蠢驴。你成功变得更差了。', B),
    L('Duas seguidas. Você treina isso?', 'Two in a row. Do you practice this?', 'Dos seguidas. ¿Entrenas esto?', 'Due di fila. Ti alleni per questo?', "Deux d'affilée. Tu t'entraînes pour ça ?", 'Zwei hintereinander. Übst du das?', '二連続。練習してるの？', '두 번 연속. 이거 연습해요?', '连错两题。你专门练过吗？'),
  ],
  wrong3: [
    L('Você é um prodígio. Do erro.', "You're a prodigy. Of failure.", 'Eres un prodigio. Del error.', "Sei un prodigio. Dell'errore.", "Tu es un prodige. De l'erreur.", 'Du bist ein Wunderkind. Im Versagen.', '天才だね。間違いの。', '천재네요. 틀리는 데.', '你是个天才。犯错的天才。', B),
    L('Eu desisto. Brincadeira, não posso. Lê a explicação, besta.', "I give up. Kidding, I can't. Read the explanation, you fool.", 'Me rindo. Es broma, no puedo. Lee la explicación, bestia.', 'Mi arrendo. Scherzo, non posso. Leggi la spiegazione, bestia.', "J'abandonne. Je rigole, je ne peux pas. Lis l'explication, andouille.", 'Ich geb auf. Spaß, darf ich nicht. Lies die Erklärung, Trottel.', 'もう諦める。冗談、無理だ。説明読め、バカ。', '포기할래요. 농담이에요, 못 해요. 설명 읽어, 바보야.', '我放弃。开玩笑的，我不能。去看解释，笨蛋。'),
  ],
  wrong_same: [
    L('Você conseguiu errar exatamente a mesma coisa.', 'You managed to get the exact same thing wrong.', 'Lograste fallar exactamente lo mismo.', 'Hai sbagliato esattamente la stessa cosa. Complimenti.', 'Tu as réussi à rater exactement la même chose.', 'Du hast es geschafft, genau dasselbe falsch zu machen.', 'まったく同じところをまた間違えたね。', '정확히 똑같은 걸 또 틀렸네요.', '你居然把同一个地方又错了。', B),
  ],
  idle: [
    L('Travou, jumento?', 'Frozen, donkey?', '¿Te trabaste, burro?', 'Bloccato, somaro?', "Bloqué, l'âne ?", 'Hängst du, Esel?', 'フリーズした、ロバ？', '멈췄어요, 당나귀?', '卡住了，蠢驴？'),
  ],
  return: [
    L('Ah, o desaparecido voltou.', 'Oh, the missing person is back.', 'Ah, volvió el desaparecido.', 'Ah, è tornato il disperso.', 'Ah, le disparu est de retour.', 'Ah, der Verschollene ist zurück.', 'あ、行方不明者が帰ってきた。', '아, 실종자가 돌아왔네.', '哟，失踪人口回来了。'),
  ],
  hard_start: [
    L('Você escolheu isso. Eu não tenho nada a ver com seu sofrimento.', 'You chose this. I have nothing to do with your suffering.', 'Tú elegiste esto. No tengo nada que ver con tu sufrimiento.', "L'hai scelto tu. Io non c'entro con la tua sofferenza.", "C'est toi qui as choisi. Je n'ai rien à voir avec ta souffrance.", 'Du hast das gewählt. Mit deinem Leiden habe ich nichts zu tun.', '選んだのは君。君の苦しみは僕のせいじゃない。', '선택한 건 당신이에요. 당신의 고통은 나랑 상관없어요.', '是你选的。你的痛苦与我无关。'),
    L('Boa sorte, besta.', 'Good luck, you fool.', 'Buena suerte, bestia.', 'Buona fortuna, bestia.', 'Bonne chance, andouille.', 'Viel Glück, Trottel.', 'がんばれ、バカ。', '행운을 빌어요, 바보.', '祝你好运，笨蛋。'),
  ],
  complete: [
    L('Acabou. Contra todas as previsões.', 'Done. Against all odds.', 'Terminado. Contra todo pronóstico.', 'Finito. Contro ogni previsione.', 'Terminé. Contre toute attente.', 'Geschafft. Allen Prognosen zum Trotz.', '終わった。予想に反して。', '끝났어요. 모든 예상을 깨고.', '完成了。出乎所有人意料。'),
    L('Parabéns, animal. Agora vai beber água.', 'Congrats, animal. Now go drink some water.', 'Felicidades, animal. Ahora ve a tomar agua.', "Complimenti, animale. Ora vai a bere un po' d'acqua.", "Bravo, l'animal. Maintenant, va boire de l'eau.", 'Glückwunsch, Tier. Jetzt geh Wasser trinken.', 'おめでとう、動物くん。水でも飲んできな。', '축하해요, 짐승. 이제 물 좀 마셔요.', '恭喜你，小动物。去喝点水吧。', B),
  ],
};
