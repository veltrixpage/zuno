/**
 * Cursos A1 · Unidade 01 de Inglês, Espanhol, Italiano, Francês, Alemão e Português.
 * Formato do exercício: [tipo, enunciado, opções (a 1ª é a certa), explicação?]
 */
import { defineCourse, lesson } from '../builder.js';
import { EXTRA } from './extras.js';

const NUM = (three, threeOpts, seven, two, ten, tenOpts) => [
  ['meaning', three, threeOpts],
  ['translate', 'sete', seven],
  ['complete', two[0], two[1], two[2]],
  ['meaning', ten, tenOpts],
];

export const en = defineCourse('en', {
  ...EXTRA.en,
  a1Lessons: [
    lesson('Cumprimentos', ['hello', 'good morning', 'goodbye', 'thank you', 'please'], [
      ['meaning', 'Hello', ['Olá', 'Tchau', 'Obrigado', 'Por favor']],
      ['translate', 'Bom dia', ['Good morning', 'Good night', 'Good afternoon', 'Goodbye']],
      ['complete', 'Thank ___ very much.', ['you', 'your', 'yours', 'me']],
      ['translate', 'Por favor', ['Please', 'Thanks', 'Sorry', 'Welcome']],
    ]),
    lesson('Apresentações', ['name', 'my', 'from', 'nice to meet you'], [
      ['complete', 'My ___ is Ana.', ['name', 'call', 'names', 'named']],
      ['translate', 'Prazer em conhecer você.', ['Nice to meet you.', 'Nice to see you later.', 'Meet you nice.', 'Pleasure you know.']],
      ['complete', "I'm ___ Brazil.", ['from', 'of', 'at', 'to'], 'Para dizer de onde você é, use "from".'],
      ['meaning', "What's your name?", ['Qual é o seu nome?', 'Como você está?', 'De onde você é?', 'Quantos anos você tem?']],
    ]),
    lesson('O verbo to be', ['am', 'is', 'are', 'student', 'teacher'], [
      ['complete', 'I ___ a student.', ['am', 'is', 'are', 'be'], 'Com "I", o verbo to be é sempre "am".'],
      ['complete', 'She ___ a teacher.', ['is', 'am', 'are', 'be'], 'He, she e it usam "is".'],
      ['complete', 'They ___ my friends.', ['are', 'is', 'am', 'be'], 'We, you e they usam "are".'],
      ['complete', 'We ___ from Brazil.', ['are', 'is', 'am', 'be'], 'We, you e they usam "are".'],
    ]),
    lesson('Números de 1 a 10', ['one', 'two', 'three', 'seven', 'ten'], NUM(
      'three', ['3', '5', '8', '13'],
      ['seven', 'six', 'eleven', 'nine'],
      ['I have ___ cats. (2)', ['two', 'too', 'to', 'tree'], '"Two" é o número 2. "Too" e "to" soam igual, mas têm outro sentido.'],
      'ten', ['10', '2', '12', '100'],
    )),
  ],
});

export const es = defineCourse('es', {
  ...EXTRA.es,
  a1Lessons: [
    lesson('Saludos', ['hola', 'buenos días', 'adiós', 'gracias', 'por favor'], [
      ['meaning', 'Hola', ['Olá', 'Tchau', 'Obrigado', 'Bom dia']],
      ['translate', 'Boa noite', ['Buenas noches', 'Buenos días', 'Buenas tardes', 'Hasta luego']],
      ['complete', '¡Hasta ___!', ['luego', 'logo', 'lugar', 'lejos'], '"¡Hasta luego!" significa "Até logo!".'],
      ['translate', 'Obrigado', ['Gracias', 'Perdón', 'De nada', 'Por favor']],
    ]),
    lesson('Presentaciones', ['me llamo', 'soy de', 'mucho gusto'], [
      ['complete', 'Me ___ Ana.', ['llamo', 'llama', 'llamas', 'llaman'], 'Com "yo" (me), o verbo fica "llamo".'],
      ['meaning', '¿Cómo te llamas?', ['Qual é o seu nome?', 'Como você está?', 'De onde você é?', 'Onde você mora?']],
      ['complete', 'Soy ___ Brasil.', ['de', 'en', 'a', 'por']],
      ['translate', 'Muito prazer.', ['Mucho gusto.', 'Mucho placer de.', 'Muy gusto.', 'Mucha gusta.']],
    ]),
    lesson('El verbo ser', ['soy', 'eres', 'es', 'somos', 'estudiante'], [
      ['complete', 'Yo ___ estudiante.', ['soy', 'es', 'eres', 'somos']],
      ['complete', 'Ella ___ profesora.', ['es', 'soy', 'eres', 'son']],
      ['complete', 'Nosotros ___ amigos.', ['somos', 'son', 'sois', 'es']],
      ['complete', '¿Tú ___ de Brasil?', ['eres', 'es', 'soy', 'son'], 'Com "tú", o verbo ser fica "eres".'],
    ]),
    lesson('Números del 1 al 10', ['uno', 'dos', 'tres', 'siete', 'diez'], NUM(
      'tres', ['3', '2', '6', '13'],
      ['siete', 'seis', 'setenta', 'nueve'],
      ['Tengo ___ gatos. (2)', ['dos', 'dois', 'doce', 'tres'], 'Em espanhol, 2 é "dos". "Doce" é 12.'],
      'diez', ['10', '12', '2', '100'],
    )),
  ],
});

export const it = defineCourse('it', {
  ...EXTRA.it,
  a1Lessons: [
    lesson('Saluti', ['ciao', 'buongiorno', 'arrivederci', 'grazie', 'per favore'], [
      ['meaning', 'Ciao', ['Olá ou tchau', 'Obrigado', 'Por favor', 'Bom dia'], '"Ciao" serve tanto para chegar quanto para ir embora.'],
      ['translate', 'Bom dia', ['Buongiorno', 'Buonasera', 'Buonanotte', 'Arrivederci']],
      ['translate', 'Obrigado', ['Grazie', 'Prego', 'Scusi', 'Per favore']],
      ['complete', 'Per ___, un caffè.', ['favore', 'favorito', 'piacere', 'grazie']],
    ]),
    lesson('Presentazioni', ['mi chiamo', 'sono di', 'piacere'], [
      ['complete', 'Mi ___ Ana.', ['chiamo', 'chiami', 'chiama', 'chiamano']],
      ['meaning', 'Come ti chiami?', ['Qual é o seu nome?', 'Como você está?', 'De onde você é?', 'Quantos anos você tem?']],
      ['complete', 'Sono ___ Roma.', ['di', 'da', 'a', 'in'], 'Para a cidade de origem, use "sono di".'],
      ['translate', 'Muito prazer.', ['Piacere.', 'Prego.', 'Per favore.', 'Grazie mille.']],
    ]),
    lesson('Il verbo essere', ['sono', 'sei', 'è', 'siamo', 'studente'], [
      ['complete', 'Io ___ studente.', ['sono', 'sei', 'è', 'siamo']],
      ['complete', 'Lei ___ insegnante.', ['è', 'sono', 'sei', 'siete']],
      ['complete', 'Noi ___ amici.', ['siamo', 'sono', 'siete', 'è']],
      ['complete', 'Tu ___ di Milano?', ['sei', 'è', 'sono', 'siamo'], 'Com "tu", o verbo essere fica "sei".'],
    ]),
    lesson('Numeri da 1 a 10', ['uno', 'due', 'tre', 'sette', 'dieci'], NUM(
      'tre', ['3', '13', '30', '6'],
      ['sette', 'sei', 'settanta', 'nove'],
      ['Ho ___ gatti. (2)', ['due', 'dodici', 'tre', 'duo']],
      'dieci', ['10', '12', '2', '100'],
    )),
  ],
});

export const fr = defineCourse('fr', {
  ...EXTRA.fr,
  a1Lessons: [
    lesson('Salutations', ['bonjour', 'bonsoir', 'au revoir', 'merci', "s'il vous plaît"], [
      ['meaning', 'Bonjour', ['Bom dia ou olá', 'Boa noite', 'Tchau', 'Obrigado']],
      ['translate', 'Até logo', ['À bientôt', 'Bonsoir', 'Merci', 'Pardon']],
      ['translate', 'Obrigado', ['Merci', 'Pardon', 'De rien', "S'il vous plaît"]],
      ['complete', "Un café, s'il vous ___.", ['plaît', 'plaisir', 'pris', 'plein']],
    ]),
    lesson('Se présenter', ["je m'appelle", 'je suis de', 'enchanté'], [
      ['complete', "Je m'___ Ana.", ['appelle', 'appelles', 'appelez', 'appellent']],
      ['meaning', "Comment tu t'appelles ?", ['Qual é o seu nome?', 'Como você está?', 'De onde você é?', 'Onde você mora?']],
      ['complete', 'Je suis ___ Paris.', ['de', 'du', 'à', 'en'], 'Para a cidade de origem, use "je suis de".'],
      ['translate', 'Muito prazer.', ['Enchanté.', 'Merci beaucoup.', 'Bienvenue.', 'De rien.']],
    ]),
    lesson('Le verbe être', ['suis', 'es', 'est', 'sommes', 'étudiant'], [
      ['complete', 'Je ___ étudiant.', ['suis', 'es', 'est', 'sommes']],
      ['complete', 'Elle ___ professeure.', ['est', 'suis', 'es', 'sont']],
      ['complete', 'Nous ___ amis.', ['sommes', 'êtes', 'sont', 'est']],
      ['complete', 'Tu ___ brésilien ?', ['es', 'est', 'suis', 'êtes'], 'Com "tu", o verbo être fica "es".'],
    ]),
    lesson('Les nombres de 1 à 10', ['un', 'deux', 'trois', 'sept', 'dix'], NUM(
      'trois', ['3', '13', '30', '6'],
      ['sept', 'six', 'seize', 'neuf'],
      ["J'ai ___ chats. (2)", ['deux', 'douze', 'dois', 'trois']],
      'dix', ['10', '12', '2', '100'],
    )),
  ],
});

export const de = defineCourse('de', {
  ...EXTRA.de,
  a1Lessons: [
    lesson('Begrüßungen', ['Hallo', 'Guten Morgen', 'Tschüss', 'Danke', 'Bitte'], [
      ['meaning', 'Hallo', ['Olá', 'Tchau', 'Obrigado', 'Por favor']],
      ['translate', 'Bom dia', ['Guten Morgen', 'Guten Abend', 'Gute Nacht', 'Tschüss']],
      ['translate', 'Obrigado', ['Danke', 'Bitte', 'Entschuldigung', 'Tschüss']],
      ['meaning', 'Tschüss', ['Tchau', 'Olá', 'Desculpe', 'Bom dia']],
    ]),
    lesson('Sich vorstellen', ['ich heiße', 'ich komme aus', 'freut mich'], [
      ['complete', 'Ich ___ Ana.', ['heiße', 'heißt', 'heißen', 'heiß']],
      ['meaning', 'Wie heißt du?', ['Qual é o seu nome?', 'Como você está?', 'De onde você é?', 'Onde você mora?']],
      ['complete', 'Ich komme ___ Brasilien.', ['aus', 'von', 'in', 'nach'], 'Para dizer de onde você vem, use "aus".'],
      ['translate', 'Muito prazer.', ['Freut mich.', 'Danke schön.', 'Bitte sehr.', 'Gute Nacht.']],
    ]),
    lesson('Das Verb sein', ['bin', 'bist', 'ist', 'sind', 'Lehrerin'], [
      ['complete', 'Ich ___ Student.', ['bin', 'bist', 'ist', 'sind']],
      ['complete', 'Anna ___ Lehrerin.', ['ist', 'bin', 'bist', 'seid']],
      ['complete', 'Wir ___ Freunde.', ['sind', 'seid', 'ist', 'bin']],
      ['complete', 'Du ___ sehr nett.', ['bist', 'ist', 'bin', 'sind'], 'Com "du", o verbo sein fica "bist".'],
    ]),
    lesson('Zahlen von 1 bis 10', ['eins', 'zwei', 'drei', 'sieben', 'zehn'], NUM(
      'drei', ['3', '13', '30', '8'],
      ['sieben', 'sechs', 'siebzehn', 'neun'],
      ['Ich habe ___ Katzen. (2)', ['zwei', 'zwölf', 'drei', 'zehn']],
      'zehn', ['10', '12', '2', '100'],
    )),
  ],
});

export const pt = defineCourse('pt', {
  ...EXTRA.pt,
  a1Lessons: [
    lesson('Cumprimentos', ['olá', 'bom dia', 'boa noite', 'obrigado', 'obrigada'], [
      ['complete', 'Bom ___! (de manhã)', ['dia', 'tarde', 'noite', 'manhã']],
      ['complete', 'Muito ___. (uma mulher agradecendo)', ['obrigada', 'obrigado', 'obrigados', 'obrigadas'], 'Quem fala concorda com o próprio gênero: mulheres dizem "obrigada".'],
      ['complete', 'Até ___!', ['logo', 'longe', 'lado', 'lugar']],
      ['complete', 'Boa ___! (antes de dormir)', ['noite', 'dia', 'tarde', 'manhã']],
    ]),
    lesson('Apresentações', ['nome', 'sou de', 'qual'], [
      ['complete', 'O meu nome ___ Ana.', ['é', 'está', 'sou', 'são']],
      ['complete', 'Eu sou ___ Lisboa.', ['de', 'em', 'a', 'para']],
      ['complete', '___ é o seu nome?', ['Qual', 'Quem', 'Quando', 'Onde']],
      ['complete', 'De onde você ___?', ['é', 'está', 'são', 'sou']],
    ]),
    lesson('O verbo ser', ['sou', 'é', 'somos', 'são', 'estudante'], [
      ['complete', 'Eu ___ estudante.', ['sou', 'é', 'somos', 'são']],
      ['complete', 'Ela ___ professora.', ['é', 'sou', 'são', 'somos']],
      ['complete', 'Nós ___ amigos.', ['somos', 'são', 'sou', 'é']],
      ['complete', 'Eles ___ do Brasil.', ['são', 'é', 'somos', 'sou']],
    ]),
    lesson('Números de 1 a 10', ['um', 'dois', 'duas', 'três', 'dez'], [
      ['complete', '2 + 1 = ___', ['três', 'dois', 'quatro', 'treze']],
      ['complete', 'Eu tenho ___ gatos. (2)', ['dois', 'duas', 'doze', 'dez']],
      ['complete', 'Ela tem ___ irmãs. (2)', ['duas', 'dois', 'doze', 'dez'], 'Com palavras femininas, 2 vira "duas".'],
      ['complete', '5 + 5 = ___', ['dez', 'doze', 'cinco', 'quinze']],
    ]),
  ],
});
