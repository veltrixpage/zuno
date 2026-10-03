/**
 * Cursos A1 · Unidade 01 de Japonês, Coreano e Mandarim.
 * Formato: [tipo, enunciado, opções (a 1ª é a certa), explicação?, leitura?]
 * A "leitura" (romaji, romanização ou pinyin) aparece embaixo do enunciado.
 */
import { defineCourse, lesson } from '../builder.js';
import { EXTRA } from './extras.js';

export const ja = defineCourse('ja', {
  ...EXTRA.ja,
  a1Lessons: [
    lesson('あいさつ · Cumprimentos', ['こんにちは', 'おはよう', 'さようなら', 'ありがとう'], [
      ['meaning', 'こんにちは', ['Olá / Boa tarde', 'Tchau', 'Obrigado', 'Desculpe'], null, 'konnichiwa'],
      ['translate', 'Bom dia', ['おはよう (ohayō)', 'こんばんは (konbanwa)', 'おやすみ (oyasumi)', 'さようなら (sayōnara)']],
      ['translate', 'Obrigado', ['ありがとう (arigatō)', 'すみません (sumimasen)', 'どうぞ (dōzo)', 'はい (hai)']],
      ['meaning', 'さようなら', ['Adeus / Tchau', 'Olá', 'Por favor', 'Bom dia'], null, 'sayōnara'],
    ]),
    lesson('じこしょうかい · Apresentações', ['わたし', 'なまえ', 'はじめまして', 'から'], [
      ['meaning', 'はじめまして', ['Prazer em conhecer (primeira vez)', 'Até logo', 'Boa noite', 'Com licença'], null, 'hajimemashite'],
      ['complete', 'わたし ___ アナです。', ['は (wa)', 'を (o)', 'に (ni)', 'で (de)'], 'A partícula は marca o tema da frase: "Quanto a mim, sou a Ana."', 'watashi ___ Ana desu'],
      ['meaning', 'おなまえは？', ['Qual é o seu nome?', 'Como vai?', 'De onde você é?', 'Quantos anos você tem?'], null, 'onamae wa?'],
      ['complete', 'ブラジル ___ きました。', ['から (kara)', 'まで (made)', 'へ (e)', 'を (o)'], 'から indica origem: "Vim do Brasil."', 'burajiru ___ kimashita'],
    ]),
    lesson('です · Ser e estar', ['です', 'がくせい', 'せんせい', 'か'], [
      ['complete', 'わたしは がくせい ___。', ['です (desu)', 'ます (masu)', 'か (ka)', 'ね (ne)'], 'です fecha frases como "eu sou estudante" de forma educada.', 'watashi wa gakusei ___'],
      ['meaning', 'せんせい', ['Professor(a)', 'Estudante', 'Amigo', 'Médico'], null, 'sensei'],
      ['meaning', 'がくせい', ['Estudante', 'Professor(a)', 'Escola', 'Livro'], null, 'gakusei'],
      ['complete', 'アナさんは せんせい です ___？', ['か (ka)', 'よ (yo)', 'ね (ne)', 'は (wa)'], 'か no fim transforma a frase em pergunta.', 'Ana-san wa sensei desu ___?'],
    ]),
    lesson('すうじ · Números de 1 a 10', ['いち', 'に', 'さん', 'なな', 'じゅう'], [
      ['meaning', 'さん (三)', ['3', '1', '4', '8'], null, 'san'],
      ['translate', 'sete', ['なな (nana)', 'はち (hachi)', 'きゅう (kyū)', 'ろく (roku)'], '7 também pode ser lido しち (shichi).'],
      ['meaning', 'に (二)', ['2', '4', '6', '20'], null, 'ni'],
      ['meaning', 'じゅう (十)', ['10', '100', '1000', '4'], null, 'jū'],
    ]),
  ],
});

export const ko = defineCourse('ko', {
  ...EXTRA.ko,
  a1Lessons: [
    lesson('인사 · Cumprimentos', ['안녕하세요', '감사합니다', '네', '안녕히 가세요'], [
      ['meaning', '안녕하세요', ['Olá', 'Obrigado', 'Tchau', 'Desculpe'], null, 'annyeonghaseyo'],
      ['translate', 'Obrigado', ['감사합니다 (gamsahamnida)', '죄송합니다 (joesonghamnida)', '안녕하세요 (annyeonghaseyo)', '괜찮아요 (gwaenchanayo)']],
      ['meaning', '네', ['Sim', 'Não', 'Olá', 'Por favor'], null, 'ne'],
      ['meaning', '안녕히 가세요', ['Tchau (para quem está indo embora)', 'Bem-vindo', 'Bom apetite', 'Boa noite'], null, 'annyeonghi gaseyo'],
    ]),
    lesson('자기소개 · Apresentações', ['저', '이름', '반갑습니다', '에서'], [
      ['complete', '저___ 아나예요.', ['는 (neun)', '를 (reul)', '에 (e)', '도 (do)'], '는 marca o tema da frase: "Eu sou a Ana."', 'jeo___ Ana-yeyo'],
      ['meaning', '반갑습니다', ['Prazer em conhecer', 'Até amanhã', 'Com licença', 'Parabéns'], null, 'bangapseumnida'],
      ['meaning', '이름이 뭐예요?', ['Qual é o seu nome?', 'Como vai?', 'De onde você é?', 'Onde você mora?'], null, 'ireumi mwoyeyo?'],
      ['complete', '브라질___ 왔어요.', ['에서 (eseo)', '에게 (ege)', '으로 (euro)', '을 (eul)'], '에서 indica origem: "Vim do Brasil."', 'beurajil___ wasseoyo'],
    ]),
    lesson('이에요 / 예요 · Ser', ['학생', '선생님', '이에요', '예요'], [
      ['complete', '저는 학생___.', ['이에요 (ieyo)', '예요 (yeyo)', '는 (neun)', '를 (reul)'], 'Depois de consoante final, use 이에요.', 'jeoneun haksaeng___'],
      ['complete', '저는 가수___.', ['예요 (yeyo)', '이에요 (ieyo)', '은 (eun)', '을 (eul)'], 'Depois de vogal, use 예요. (가수 = cantor)', 'jeoneun gasu___'],
      ['meaning', '선생님', ['Professor(a)', 'Estudante', 'Amigo', 'Mãe'], null, 'seonsaengnim'],
      ['meaning', '학생', ['Estudante', 'Escola', 'Professor(a)', 'Livro'], null, 'haksaeng'],
    ]),
    lesson('숫자 · Números de 1 a 10', ['일', '이', '삼', '칠', '십'], [
      ['meaning', '삼', ['3', '1', '4', '8'], null, 'sam'],
      ['translate', 'sete', ['칠 (chil)', '팔 (pal)', '구 (gu)', '육 (yuk)']],
      ['meaning', '이', ['2', '4', '1', '10'], null, 'i'],
      ['meaning', '십', ['10', '100', '1000', '4'], null, 'sip'],
    ]),
  ],
});

export const zh = defineCourse('zh', {
  ...EXTRA.zh,
  a1Lessons: [
    lesson('问候 · Cumprimentos', ['你好', '谢谢', '再见', '早上好'], [
      ['meaning', '你好', ['Olá', 'Obrigado', 'Tchau', 'Desculpe'], null, 'nǐ hǎo'],
      ['translate', 'Obrigado', ['谢谢 (xièxie)', '对不起 (duìbuqǐ)', '再见 (zàijiàn)', '没关系 (méi guānxi)']],
      ['meaning', '再见', ['Tchau / Até logo', 'Olá', 'Por favor', 'Bom dia'], null, 'zàijiàn'],
      ['translate', 'Bom dia', ['早上好 (zǎoshang hǎo)', '晚上好 (wǎnshang hǎo)', '晚安 (wǎn’ān)', '你好吗 (nǐ hǎo ma)']],
    ]),
    lesson('自我介绍 · Apresentações', ['我', '叫', '名字', '认识'], [
      ['complete', '你叫什么___？', ['名字 (míngzi)', '地方 (dìfang)', '时候 (shíhou)', '东西 (dōngxi)'], '"你叫什么名字？" = Qual é o seu nome?', 'nǐ jiào shénme ___?'],
      ['meaning', '很高兴认识你', ['Prazer em conhecer você', 'Até amanhã', 'Muito obrigado', 'Boa viagem'], null, 'hěn gāoxìng rènshi nǐ'],
      ['complete', '我___巴西人。', ['是 (shì)', '有 (yǒu)', '在 (zài)', '叫 (jiào)'], '是 liga o sujeito a quem ele é: "Eu sou brasileiro."', 'wǒ ___ Bāxī rén'],
      ['meaning', '我叫安娜。', ['Meu nome é Ana.', 'Eu sou do Brasil.', 'Eu gosto da Ana.', 'Ana é minha amiga.'], null, 'wǒ jiào Ānnà'],
    ]),
    lesson('是 · Ser', ['是', '学生', '老师', '吗'], [
      ['complete', '我___学生。', ['是 (shì)', '有 (yǒu)', '在 (zài)', '很 (hěn)'], null, 'wǒ ___ xuéshēng'],
      ['meaning', '老师', ['Professor(a)', 'Estudante', 'Amigo', 'Médico'], null, 'lǎoshī'],
      ['complete', '你是学生___？', ['吗 (ma)', '的 (de)', '了 (le)', '很 (hěn)'], '吗 no fim transforma a frase em pergunta de sim ou não.', 'nǐ shì xuéshēng ___?'],
      ['meaning', '学生', ['Estudante', 'Escola', 'Professor(a)', 'Livro'], null, 'xuéshēng'],
    ]),
    lesson('数字 · Números de 1 a 10', ['一', '二', '三', '七', '十'], [
      ['meaning', '三', ['3', '1', '4', '8'], null, 'sān'],
      ['translate', 'sete', ['七 (qī)', '八 (bā)', '九 (jiǔ)', '六 (liù)']],
      ['meaning', '二', ['2', '4', '1', '10'], null, 'èr'],
      ['meaning', '十', ['10', '100', '1000', '4'], null, 'shí'],
    ]),
  ],
});
