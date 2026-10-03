/**
 * Prompt 3: novos tipos de atividade e traduções das frases para o feedback.
 * extras[n] → exercícios acrescentados ao fim da Aula n da Unidade 01.
 * translations → frase completa em português (mostrada em "Correto: … / tradução").
 */
export const EXTRA = {
  en: {
    translations: {
      'Thank ___ very much.': 'Muito obrigado.',
      'My ___ is Ana.': 'Meu nome é Ana.',
      "I'm ___ Brazil.": 'Eu sou do Brasil.',
      'I ___ a student.': 'Eu sou estudante.',
      'She ___ a teacher.': 'Ela é professora.',
      'They ___ my friends.': 'Eles são meus amigos.',
      'We ___ from Brazil.': 'Nós somos do Brasil.',
      'I have ___ cats. (2)': 'Eu tenho dois gatos.',
    },
    extras: {
      1: [
        { type: 'match', pairs: [['hello', 'olá'], ['goodbye', 'tchau'], ['thank you', 'obrigado'], ['please', 'por favor']] },
        { type: 'listen', say: 'Good morning', options: ['Good morning', 'Good night', 'Good evening', 'Goodbye'], translation: 'Bom dia' },
      ],
      2: [
        { type: 'order', translation: 'Meu nome é Ana.', tokens: ['My', 'name', 'is', 'Ana.'], distractors: ['am', 'your'] },
        { type: 'reading', passage: "Hi! I'm Tom. I'm from Canada. I'm a teacher.", question: 'De onde o Tom é?', options: ['Do Canadá', 'Do Brasil', 'Dos Estados Unidos', 'Da Inglaterra'] },
        { type: 'phrase', question: 'Qual frase significa “De onde você é?”', options: ['Where are you from?', 'Where do you live?', 'What is your name?', 'How are you?'] },
      ],
      3: [
        { type: 'truefalse', statement: 'She are a teacher.', truth: false, explanation: 'Com "she", usamos "is": She is a teacher.' },
        { type: 'write', prompt: 'He ___ a doctor.', accept: ['is'], translation: 'Ele é médico.', explanation: 'He, she e it usam "is".' },
        { type: 'wordpick', sentence: 'She is a good teacher', target: 'teacher', question: 'Toque na palavra que significa “professora”.' },
        { type: 'open', prompt: 'Apresente-se em inglês: diga seu nome e de onde você é.', sample: "My name is Ana. I'm from Brazil.", keywords: [['name', "i'm", 'i am'], ['from']] },
      ],
      4: [
        { type: 'translate', prompt: 'cinco', accept: ['five'] },
      ],
    },
  },
  es: {
    translations: {
      '¡Hasta ___!': 'Até logo!',
      'Me ___ Ana.': 'Eu me chamo Ana.',
      'Soy ___ Brasil.': 'Sou do Brasil.',
      'Yo ___ estudiante.': 'Eu sou estudante.',
      'Ella ___ profesora.': 'Ela é professora.',
      'Nosotros ___ amigos.': 'Nós somos amigos.',
      '¿Tú ___ de Brasil?': 'Você é do Brasil?',
      'Tengo ___ gatos. (2)': 'Tenho dois gatos.',
    },
    extras: {
      1: [{ type: 'match', pairs: [['hola', 'olá'], ['adiós', 'tchau'], ['gracias', 'obrigado'], ['buenas noches', 'boa noite']] }],
      2: [{ type: 'order', translation: 'Eu me chamo Ana.', tokens: ['Me', 'llamo', 'Ana.'], distractors: ['llama', 'soy'] }],
      3: [
        { type: 'truefalse', statement: 'Ella eres profesora.', truth: false, explanation: 'Com "ella", usamos "es": Ella es profesora.' },
        { type: 'write', prompt: 'Él ___ médico.', accept: ['es'], translation: 'Ele é médico.', explanation: 'Com "él" e "ella", o verbo ser fica "es".' },
      ],
    },
  },
  it: {
    translations: {
      'Per ___, un caffè.': 'Um café, por favor.',
      'Mi ___ Ana.': 'Eu me chamo Ana.',
      'Sono ___ Roma.': 'Sou de Roma.',
      'Io ___ studente.': 'Eu sou estudante.',
      'Lei ___ insegnante.': 'Ela é professora.',
      'Noi ___ amici.': 'Nós somos amigos.',
      'Tu ___ di Milano?': 'Você é de Milão?',
      'Ho ___ gatti. (2)': 'Tenho dois gatos.',
    },
    extras: {
      1: [{ type: 'match', pairs: [['ciao', 'olá / tchau'], ['grazie', 'obrigado'], ['buonanotte', 'boa noite'], ['per favore', 'por favor']] }],
      2: [{ type: 'order', translation: 'Eu me chamo Ana.', tokens: ['Mi', 'chiamo', 'Ana.'], distractors: ['chiama', 'sono'] }],
      3: [
        { type: 'truefalse', statement: 'Lei sei insegnante.', truth: false, explanation: 'Com "lei", usamos "è": Lei è insegnante.' },
        { type: 'write', prompt: 'Lui ___ medico.', accept: ['è'], translation: 'Ele é médico.', explanation: 'Com "lui" e "lei", o verbo essere fica "è".' },
      ],
    },
  },
  fr: {
    translations: {
      "Un café, s'il vous ___.": 'Um café, por favor.',
      "Je m'___ Ana.": 'Eu me chamo Ana.',
      'Je suis ___ Paris.': 'Sou de Paris.',
      'Je ___ étudiant.': 'Eu sou estudante.',
      'Elle ___ professeure.': 'Ela é professora.',
      'Nous ___ amis.': 'Nós somos amigos.',
      'Tu ___ brésilien ?': 'Você é brasileiro?',
      "J'ai ___ chats. (2)": 'Tenho dois gatos.',
    },
    extras: {
      1: [{ type: 'match', pairs: [['bonjour', 'bom dia / olá'], ['merci', 'obrigado'], ['au revoir', 'tchau'], ['bonsoir', 'boa noite']] }],
      2: [{ type: 'order', translation: 'Eu me chamo Ana.', tokens: ['Je', "m'appelle", 'Ana.'], distractors: ['suis', 'appelles'] }],
      3: [
        { type: 'truefalse', statement: 'Elle es professeure.', truth: false, explanation: 'Com "elle", usamos "est": Elle est professeure.' },
        { type: 'write', prompt: 'Il ___ médecin.', accept: ['est'], translation: 'Ele é médico.', explanation: 'Com "il" e "elle", o verbo être fica "est".' },
      ],
    },
  },
  de: {
    translations: {
      'Ich ___ Ana.': 'Eu me chamo Ana.',
      'Ich komme ___ Brasilien.': 'Eu venho do Brasil.',
      'Ich ___ Student.': 'Eu sou estudante.',
      'Anna ___ Lehrerin.': 'Anna é professora.',
      'Wir ___ Freunde.': 'Nós somos amigos.',
      'Du ___ sehr nett.': 'Você é muito legal.',
      'Ich habe ___ Katzen. (2)': 'Tenho dois gatos.',
    },
    extras: {
      1: [{ type: 'match', pairs: [['Hallo', 'olá'], ['Danke', 'obrigado'], ['Tschüss', 'tchau'], ['Bitte', 'por favor']] }],
      2: [{ type: 'order', translation: 'Eu me chamo Ana.', tokens: ['Ich', 'heiße', 'Ana.'], distractors: ['heißt', 'bin'] }],
      3: [
        { type: 'truefalse', statement: 'Wir ist Freunde.', truth: false, explanation: 'Com "wir", usamos "sind": Wir sind Freunde.' },
        { type: 'write', prompt: 'Er ___ Arzt.', accept: ['ist'], translation: 'Ele é médico.', explanation: 'Com "er", "sie" e "es", o verbo sein fica "ist".' },
      ],
    },
  },
  pt: {
    translations: {},
    extras: {
      1: [{ type: 'match', pairs: [['bom dia', 'de manhã'], ['boa tarde', 'depois do almoço'], ['boa noite', 'à noite'], ['tchau', 'na despedida']] }],
      2: [{ type: 'order', translation: 'Diga que o seu nome é Ana.', tokens: ['O', 'meu', 'nome', 'é', 'Ana.'], distractors: ['sou', 'está'] }],
      3: [
        { type: 'truefalse', statement: 'Nós são amigos.', truth: false, explanation: 'Com "nós", usamos "somos": Nós somos amigos.' },
        { type: 'write', prompt: 'Vocês ___ do Brasil.', accept: ['são'], explanation: 'Com "vocês" e "eles", o verbo ser fica "são".' },
      ],
    },
  },
  ja: {
    translations: {
      'わたし ___ アナです。': 'Eu sou a Ana.',
      'ブラジル ___ きました。': 'Vim do Brasil.',
      'わたしは がくせい ___。': 'Eu sou estudante.',
      'アナさんは せんせい です ___？': 'A Ana é professora?',
    },
    extras: {
      1: [{ type: 'match', pairs: [['こんにちは', 'olá'], ['ありがとう', 'obrigado'], ['さようなら', 'tchau'], ['おはよう', 'bom dia']] }],
      2: [{ type: 'order', translation: 'Eu sou a Ana.', tokens: ['わたし', 'は', 'アナ', 'です。'], distractors: ['を', 'か'], join: '' }],
      3: [
        { type: 'truefalse', statement: '“がくせい” significa “professor”.', truth: false, explanation: 'がくせい (gakusei) = estudante. せんせい (sensei) = professor.' },
        { type: 'truefalse', statement: '“か” no fim da frase faz uma pergunta.', truth: true, explanation: 'か (ka) no fim transforma a frase em pergunta.' },
      ],
    },
  },
  ko: {
    translations: {
      '저___ 아나예요.': 'Eu sou a Ana.',
      '브라질___ 왔어요.': 'Vim do Brasil.',
      '저는 학생___.': 'Eu sou estudante.',
      '저는 가수___.': 'Eu sou cantor(a).',
    },
    extras: {
      1: [{ type: 'match', pairs: [['안녕하세요', 'olá'], ['감사합니다', 'obrigado'], ['네', 'sim'], ['안녕히 가세요', 'tchau']] }],
      2: [{ type: 'order', translation: 'Eu sou estudante.', tokens: ['저는', '학생이에요.'], distractors: ['가수예요.', '를'] }],
      3: [
        { type: 'truefalse', statement: '“선생님” significa “professor(a)”.', truth: true, explanation: '선생님 (seonsaengnim) = professor(a).' },
        { type: 'truefalse', statement: 'Depois de vogal, usamos 이에요.', truth: false, explanation: 'Depois de vogal usamos 예요. Depois de consoante, 이에요.' },
      ],
    },
  },
  zh: {
    translations: {
      '你叫什么___？': 'Qual é o seu nome?',
      '我___巴西人。': 'Eu sou brasileiro(a).',
      '我___学生。': 'Eu sou estudante.',
      '你是学生___？': 'Você é estudante?',
    },
    extras: {
      1: [{ type: 'match', pairs: [['你好', 'olá'], ['谢谢', 'obrigado'], ['再见', 'tchau'], ['早上好', 'bom dia']] }],
      2: [{ type: 'order', translation: 'Eu sou brasileiro(a).', tokens: ['我', '是', '巴西人。'], distractors: ['叫', '吗'], join: '' }],
      3: [
        { type: 'truefalse', statement: '“老师” significa “estudante”.', truth: false, explanation: '老师 (lǎoshī) = professor(a). 学生 (xuéshēng) = estudante.' },
        { type: 'truefalse', statement: '“吗” no fim da frase faz uma pergunta de sim ou não.', truth: true, explanation: '吗 (ma) no fim transforma a frase em pergunta.' },
      ],
    },
  },
};
