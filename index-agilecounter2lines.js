//
// Export as Cards the Agile Counter assessment questions
//

const counter = require('/Users/jacques/Dropbox/-work/projects/AgileCounter/AgileCounter/Resources/Data/assessment.json');

function q2c(question, group) {
    const q = question.question;
    const roles = q.roles && q.roles.length > 0 ? ` [${q.roles.join(',')}]` : '';
    return {
        epic: group.title + roles,
        ...q,
        title: `[${q.questionId.replace('q', '')}] ${q.title}`
    };
}

const flattenGroup = function (group) {
    if (!group) return [];
    const questions = group.questions.map(q => q2c(q, group));
    const children = group.subGroups.reduce((acc, subgroup) => acc.concat(...flattenGroup(subgroup.group)), []);
    return questions.concat(...children);
};

const questions = flattenGroup(counter.assessment.questions.group);

// questions.sort((a, b) => a.questionId.localeCompare(b.questionId)).forEach(q => console.log('>>>>> ', JSON.stringify(q)));
console.log('>>>>> ', questions.length);

const outputFile = 'agilecounter.pdf';
const pdf = require('./export/pdf-export');
pdf.exportCardsAsPdf(questions, outputFile);
