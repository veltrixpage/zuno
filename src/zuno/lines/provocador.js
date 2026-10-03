/**
 * Personalidade PROVOCADORA (disponível no Free).
 * Zoeira divertida, mas o Zuno continua professor: depois da provocação,
 * a tela sempre mostra a resposta certa e a explicação.
 */
import { L } from './line.js';

const M = { laugh: 'mischievous' };

export default {
  correct: [
    L('Olha só, acertou.', 'Well, look at that. You got it.', 'Mira nada más, acertaste.', "Guarda un po', ci hai preso.", "Tiens donc, c'est juste.", 'Sieh mal an, richtig.', 'へえ、正解じゃん。', '오, 맞혔네?', '哟，答对了。'),
    L('Não se acostuma.', "Don't get used to it.", 'No te acostumbres.', 'Non abituarti.', "Ne t'y habitue pas.", 'Gewöhn dich nicht dran.', '調子に乗らないでね。', '익숙해지지 마요.', '别太得意。'),
    L('Ok, essa foi boa. Admito.', 'Okay, that was good. I admit it.', 'Vale, esa estuvo bien. Lo admito.', 'Ok, questa era buona. Lo ammetto.', "Ok, celle-là était bien. Je l'avoue.", 'Okay, die war gut. Geb ich zu.', 'まあ、今のは良かった。認める。', '좋아, 이번 건 인정.', '好吧，这个不错。我承认。'),
    L('Sorte ou talento? Vamos ver.', "Luck or talent? We'll see.", '¿Suerte o talento? Ya veremos.', 'Fortuna o talento? Vedremo.', 'Chance ou talent ? On verra.', 'Glück oder Talent? Mal sehen.', '運？実力？見ものだね。', '운이에요, 실력이에요? 두고 보죠.', '运气还是实力？走着瞧。'),
    L('Até que enfim.', 'Finally.', 'Por fin.', 'Finalmente.', 'Enfin.', 'Na endlich.', 'やっとだね。', '드디어.', '终于。'),
    L('Mandou bem. Não conta pra ninguém que eu elogiei.', "Nice one. Don't tell anyone I said that.", 'Bien hecho. No le digas a nadie que te elogié.', 'Ben fatto. Non dirlo a nessuno.', 'Bien joué. Ne le répète à personne.', 'Gut gemacht. Sag keinem, dass ich dich gelobt habe.', 'やるじゃん。褒めたのは内緒ね。', '잘했어요. 내가 칭찬한 건 비밀.', '干得好。别告诉别人我夸你了。'),
  ],
  proud: [
    L('Tá se achando, né? Com razão.', 'Feeling yourself, huh? Fair enough.', 'Te lo crees, ¿eh? Con razón.', 'Ti senti un genio, eh? A ragione.', 'Tu te la racontes, hein ? Avec raison.', 'Du fühlst dich gut, was? Zu Recht.', '調子乗ってるね？まあ、当然か。', '잘난 척하네요? 그럴 만해요.', '有点飘了吧？也难怪。', M),
    L('Quem é você e o que fez com o aluno?', 'Who are you and what did you do with my student?', '¿Quién eres y qué hiciste con mi alumno?', 'Chi sei e cosa hai fatto al mio studente?', "Qui es-tu et qu'as-tu fait de mon élève ?", 'Wer bist du und was hast du mit meinem Schüler gemacht?', '君は誰？僕の生徒をどこへやった？', '누구세요? 내 학생은 어디 갔어요?', '你是谁？我的学生去哪儿了？'),
  ],
  comeback: [
    L('Ah, agora sim. Precisava errar antes?', 'Oh, now you get it. Did you need to miss first?', 'Ah, ahora sí. ¿Tenías que fallar antes?', 'Ah, ora sì. Dovevi sbagliare prima?', 'Ah, là oui. Il fallait rater avant ?', 'Ah, jetzt aber. Musstest du erst danebenliegen?', 'あ、今度は正解。先に間違える必要あった？', '아, 이제야. 꼭 먼저 틀려야 했어요?', '啊，这次对了。非得先错一次吗？'),
    L('Ressuscitou.', 'Back from the dead.', '¡Resucitaste!', 'Resurrezione!', 'Résurrection !', 'Von den Toten auferstanden.', '復活！', '부활했네요.', '满血复活。'),
  ],
  wrong1: [
    L('Não era essa. Mas gostei da confiança.', 'Not that one. But I like the confidence.', 'No era esa. Pero me gustó la confianza.', 'Non era questa. Ma mi piace la sicurezza.', "Ce n'était pas ça. Mais j'aime l'assurance.", "Das war's nicht. Aber das Selbstvertrauen gefällt mir.", '違うよ。でも自信は気に入った。', '그거 아니에요. 그래도 자신감은 좋네요.', '不是这个。不过我喜欢你的自信。'),
    L('Parabéns pela confiança. A resposta continua errada.', 'Congrats on the confidence. The answer is still wrong.', 'Felicidades por la confianza. La respuesta sigue mal.', 'Complimenti per la sicurezza. La risposta resta sbagliata.', "Bravo pour l'assurance. La réponse est toujours fausse.", 'Glückwunsch zum Selbstvertrauen. Die Antwort ist trotzdem falsch.', '自信だけは満点。答えは不正解。', '자신감은 칭찬해요. 답은 여전히 틀렸어요.', '自信可嘉。答案还是错的。'),
    L('Você sabia essa.', 'You knew this one.', 'Esta te la sabías.', 'Questa la sapevi.', 'Tu la savais, celle-là.', 'Die wusstest du.', 'これ知ってたでしょ。', '이거 알잖아요.', '这个你明明会。'),
    L('Calma, gênio.', 'Easy there, genius.', 'Tranquilo, genio.', 'Calma, genio.', 'Doucement, génie.', 'Ganz ruhig, Genie.', '落ち着いて、天才くん。', '진정해요, 천재님.', '冷静点，天才。'),
    L('Você e essa resposta claramente não se entenderam.', "You and that answer clearly didn't get along.", 'Tú y esa respuesta claramente no se entendieron.', 'Tu e quella risposta chiaramente non vi siete capiti.', "Toi et cette réponse, ça n'a clairement pas collé.", 'Du und diese Antwort, das passt offensichtlich nicht.', '君とその答え、相性悪いみたいだね。', '그 답이랑은 확실히 안 맞네요.', '你和这个答案显然合不来。'),
    L('Você acabou de assassinar a gramática.', 'You just murdered the grammar.', 'Acabas de asesinar la gramática.', 'Hai appena assassinato la grammatica.', 'Tu viens d’assassiner la grammaire.', 'Du hast gerade die Grammatik ermordet.', '今、文法が死んだよ。', '방금 문법을 살해했어요.', '你刚刚谋杀了语法。', M),
  ],
  wrong2: [
    L('Errou de novo, mds. 😂', 'Wrong again. Oh my god. 😂', 'Otra vez mal. Dios mío. 😂', 'Di nuovo sbagliato. Mamma mia. 😂', 'Encore faux. Mon Dieu. 😂', 'Schon wieder falsch. Oh Gott. 😂', 'また間違えた。もう〜😂', '또 틀렸어요. 맙소사. 😂', '又错了。天哪。😂', M),
    L('De novo? Mds. 😂', 'Again? OMG. 😂', '¿Otra vez? Madre mía. 😂', 'Ancora? Mamma mia. 😂', 'Encore ? Oh là là. 😂', 'Schon wieder? Meine Güte. 😂', 'また？うそでしょ😂', '또요? 세상에. 😂', '又来？我的天。😂', M),
    L('Essa doeu até em mim.', 'That one hurt even me.', 'Esa me dolió hasta a mí.', 'Questa ha fatto male anche a me.', "Celle-là m'a fait mal à moi aussi.", 'Das tat sogar mir weh.', '今のは僕まで痛かった。', '이건 나까지 아팠어요.', '这个连我都心疼。'),
    L('Vamos fingir que isso nunca aconteceu.', "Let's pretend that never happened.", 'Finjamos que eso nunca pasó.', 'Facciamo finta che non sia mai successo.', "On va faire comme si ça n'était jamais arrivé.", 'Tun wir so, als wäre das nie passiert.', '今のはなかったことにしよう。', '못 본 걸로 할게요.', '就当这事没发生过。'),
  ],
  wrong3: [
    L('Eu estava acreditando em você.', 'I was believing in you.', 'Yo creía en ti.', 'Io credevo in te.', 'Je croyais en toi.', "Ich hab an dich geglaubt.", '信じてたのに。', '믿고 있었는데.', '我本来很相信你的。'),
    L('Mais uma errada. Tá virando hábito.', "Another miss. It's becoming a habit.", 'Otro fallo. Se está volviendo costumbre.', "Un altro errore. Sta diventando un'abitudine.", 'Encore une erreur. Ça devient une habitude.', 'Noch ein Fehler. Das wird langsam zur Gewohnheit.', 'また間違い。もう習慣だね。', '또 틀렸네요. 습관이 되겠어요.', '又错了。都快成习惯了。', M),
    L('Tô começando a ficar preocupado.', "I'm starting to get worried.", 'Me estoy empezando a preocupar.', 'Comincio a preoccuparmi.', "Je commence à m'inquiéter.", 'Ich mache mir langsam Sorgen.', 'ちょっと心配になってきた。', '슬슬 걱정되기 시작해요.', '我开始担心了。'),
  ],
  wrong_same: [
    L('A mesma de novo? Sério?', 'The same one again? Seriously?', '¿La misma otra vez? ¿En serio?', 'Di nuovo la stessa? Sul serio?', 'La même encore ? Sérieux ?', 'Dieselbe nochmal? Im Ernst?', '同じ問題でまた？本気？', '같은 문제를 또요? 진심이에요?', '同一题又错？认真的吗？', M),
  ],
  idle: [
    L('Dormiu?', 'Did you fall asleep?', '¿Te dormiste?', 'Dormi?', 'Tu dors ?', 'Eingeschlafen?', '寝てる？', '자요?', '睡着了？'),
    L('Pensando muito ou só olhando pro nada?', 'Thinking hard or just staring into space?', '¿Pensando mucho o mirando a la nada?', 'Pensi tanto o fissi il vuoto?', 'Tu réfléchis ou tu fixes le vide ?', 'Denkst du nach oder starrst du ins Leere?', '考え中？それともぼーっとしてる？', '생각 중이에요, 아니면 멍 때리는 중이에요?', '在思考还是在发呆？'),
  ],
  return: [
    L('Olha quem lembrou que eu existo.', 'Look who remembered I exist.', 'Mira quién se acordó de que existo.', 'Guarda chi si è ricordato che esisto.', "Regarde qui se souvient que j'existe.", 'Sieh mal, wer sich an mich erinnert.', '僕のこと思い出したんだ？', '누가 나를 기억해냈나 봐요.', '哟，终于想起我了。'),
  ],
  hard_start: [
    L('Você pediu difícil.', 'You asked for hard.', 'Tú pediste difícil.', "L'hai voluto difficile.", 'Tu as voulu du difficile.', 'Du wolltest es schwer.', '難しいのを選んだのは君だよ。', '어려운 걸 원한 건 당신이에요.', '是你自己要难的。'),
    L('Agora não reclama.', "Now don't complain.", 'Ahora no te quejes.', 'Ora non lamentarti.', 'Maintenant, ne te plains pas.', 'Jetzt beschwer dich nicht.', '文句言わないでね。', '이제 불평하지 마요.', '现在别抱怨。'),
  ],
  complete: [
    L('Sobreviveu. Parabéns.', 'You survived. Congrats.', 'Sobreviviste. Felicidades.', "Ce l'hai fatta. Complimenti.", 'Tu as survécu. Bravo.', 'Überlebt. Glückwunsch.', '生き延びたね。おめでとう。', '살아남았네요. 축하해요.', '你活下来了。恭喜。'),
    L('Nada mal. Pra você.', 'Not bad. For you.', 'Nada mal. Para ti.', 'Niente male. Per te.', 'Pas mal. Pour toi.', 'Nicht schlecht. Für deine Verhältnisse.', '悪くないね。君にしては。', '나쁘지 않네요. 당신치고는.', '不错。以你的水平来说。', M),
  ],
};
