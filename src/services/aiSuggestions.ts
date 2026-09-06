import type { FormData } from '../types/form';

export interface AISuggestion {
  id: string;
  type: 'summary' | 'experience' | 'skills' | 'improvement';
  field: string;
  original: string;
  suggestion: string;
  reason: string;
}

const summaryTemplates = [
  'Results-driven professional with {years}+ years of experience in {domain}. Proven track record of {achievement}, delivering {impact} across {scope} projects. Adept at {skill1}, {skill2}, and {skill3}, with a passion for {passion}.',
  'Dynamic {role} combining deep expertise in {domain} with strong {skill1} capabilities. Successfully {achievement}, resulting in {impact}. Seeking to leverage {skill1} and {skill2} to drive {goal}.',
  'Accomplished {role} with a demonstrated history of {achievement}. Skilled in {skill1}, {skill2}, and {skill3}. Known for {trait} and the ability to {ability}.',
];

const experienceBulletTemplates = [
  'Spearheaded {action} that resulted in {metric} improvement in {area}',
  'Led a team of {teamSize} to {achievement}, reducing {metric} by {percent}%',
  'Designed and implemented {solution} serving {users}+ users, achieving {metric}',
  'Optimized {system} resulting in {percent}% faster {process} and {cost} cost reduction',
  'Collaborated with {stakeholders} to deliver {project} on time and {percent}% under budget',
];

const skillSuggestions: Record<string, string[]> = {
  javascript: ['TypeScript', 'React', 'Node.js', 'Next.js', 'Express.js', 'REST APIs', 'GraphQL'],
  python: ['Django', 'Flask', 'FastAPI', 'Pandas', 'NumPy', 'Machine Learning', 'AWS'],
  java: ['Spring Boot', 'Microservices', 'Hibernate', 'Maven', 'JUnit', 'AWS', 'Docker'],
  react: ['Redux', 'Context API', 'React Router', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Jest'],
  node: ['Express.js', 'NestJS', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
  sql: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Data Modeling', 'ETL'],
  devops: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Jenkins', 'GitHub Actions'],
  management: [
    'Agile',
    'Scrum',
    'Team Leadership',
    'Stakeholder Management',
    'Budgeting',
    'Mentoring',
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

function suggestSummary(data: FormData): AISuggestion[] {
  const suggestions: AISuggestion[] = [];
  const { personalData, introduction, skills, experiences } = data;

  if (!introduction.professionalSummary || introduction.professionalSummary.length < 50) {
    const skillList = skills.flatMap((s) =>
      s.technicalSkills
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    );
    const primarySkills = skillList.slice(0, 3);
    const years = experiences.length > 0 ? `${Math.max(experiences.length * 2, 3)}` : '3';
    const role = personalData.fullName
      ? `${personalData.fullName.split(' ')[0]}'s professional profile`
      : 'Professional profile';

    const template = pickRandom(summaryTemplates);
    const suggestion = fillTemplate(template, {
      years,
      domain: primarySkills[0] || 'software engineering',
      achievement: 'delivering high-impact solutions',
      impact: 'measurable business results',
      scope: `${Math.max(experiences.length, 2)}`,
      skill1: primarySkills[0] || 'technical leadership',
      skill2: primarySkills[1] || 'cross-functional collaboration',
      skill3: primarySkills[2] || 'problem-solving',
      passion: 'innovation and continuous improvement',
      role,
      goal: 'organizational success',
      trait: 'technical excellence',
      ability: 'translate complex requirements into elegant solutions',
    });

    suggestions.push({
      id: generateId(),
      type: 'summary',
      field: 'professionalSummary',
      original: introduction.professionalSummary || '',
      suggestion,
      reason:
        'Your summary is too short or empty. A strong summary should be 2-4 sentences highlighting your key qualifications.',
    });
  }

  return suggestions;
}

function suggestExperience(data: FormData): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  data.experiences.forEach((exp) => {
    if (!exp.achievements || exp.achievements.split('\n').filter(Boolean).length < 3) {
      const bullets = Array.from({ length: 3 }, () => pickRandom(experienceBulletTemplates));
      suggestions.push({
        id: generateId(),
        type: 'experience',
        field: `experience.${exp.id}.achievements`,
        original: exp.achievements,
        suggestion: bullets.join('\n'),
        reason: `Experience at "${exp.company || 'this company'}" should have 3-5 quantified bullet points. Each bullet should start with a strong action verb and include measurable results.`,
      });
    }
  });

  return suggestions;
}

function suggestSkills(data: FormData): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  data.skills.forEach((skill) => {
    if (skill.technicalSkills) {
      const existing = skill.technicalSkills.split(',').map((s) => s.trim().toLowerCase());
      const allSuggestions = new Set<string>();

      existing.forEach((s) => {
        const key = Object.keys(skillSuggestions).find((k) => s.includes(k));
        if (key) {
          skillSuggestions[key].forEach((sug) => {
            if (!existing.includes(sug.toLowerCase())) {
              allSuggestions.add(sug);
            }
          });
        }
      });

      if (allSuggestions.size > 0) {
        suggestions.push({
          id: generateId(),
          type: 'skills',
          field: `skills.${skill.id}.technicalSkills`,
          original: skill.technicalSkills,
          suggestion: [
            ...existing.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
            ...Array.from(allSuggestions).slice(0, 5),
          ].join(', '),
          reason: `Based on your existing skills, consider adding: ${Array.from(allSuggestions).slice(0, 5).join(', ')}. These are commonly paired with your current tech stack.`,
        });
      }
    }
  });

  return suggestions;
}

function suggestImprovements(data: FormData): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  if (!data.personalData.linkedin) {
    suggestions.push({
      id: generateId(),
      type: 'improvement',
      field: 'personalData.linkedin',
      original: '',
      suggestion: 'Add your LinkedIn profile URL',
      reason:
        '92% of recruiters use LinkedIn to verify candidates. A complete profile increases your chances by 40%.',
    });
  }

  if (!data.introduction.objectiveStatement) {
    suggestions.push({
      id: generateId(),
      type: 'improvement',
      field: 'introduction.objectiveStatement',
      original: '',
      suggestion: 'Add a clear career objective tailored to your target role',
      reason:
        'A well-crafted objective helps recruiters understand your goals and match you with relevant opportunities.',
    });
  }

  data.educations.forEach((edu) => {
    if (!edu.description) {
      suggestions.push({
        id: generateId(),
        type: 'improvement',
        field: `education.${edu.id}.description`,
        original: '',
        suggestion: `Add a description for your ${edu.degree} at ${edu.institution || 'this institution'}`,
        reason:
          'Including relevant coursework, projects, or academic achievements strengthens your education section.',
      });
    }
  });

  return suggestions;
}

export function generateAISuggestions(formData: FormData): AISuggestion[] {
  return [
    ...suggestSummary(formData),
    ...suggestExperience(formData),
    ...suggestSkills(formData),
    ...suggestImprovements(formData),
  ];
}

export function improveText(text: string, context: string): string {
  if (!text || text.length < 10) return text;

  const improvements: Record<string, string[]> = {
    achievement: [
      'Spearheaded a comprehensive initiative',
      'Orchestrated a cross-functional effort',
      'Pioneered an innovative approach',
      'Championed a strategic transformation',
    ],
    leadership: [
      'Mentored and developed a high-performing team',
      'Fostered a culture of continuous improvement',
      'Drove organizational change through strategic vision',
      'Aligned technical strategy with business objectives',
    ],
    technical: [
      'Architected scalable, maintainable solutions',
      'Implemented best practices and coding standards',
      'Optimized system performance through data-driven analysis',
      'Integrated cutting-edge technologies to enhance capabilities',
    ],
  };

  const category =
    context.toLowerCase().includes('lead') || context.toLowerCase().includes('manage')
      ? 'leadership'
      : context.toLowerCase().includes('develop') || context.toLowerCase().includes('engineer')
        ? 'technical'
        : 'achievement';

  const prefix = pickRandom(improvements[category] || improvements.achievement);
  return `${prefix}: ${text.charAt(0).toLowerCase() + text.slice(1)}`;
}
