import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import React from 'react';

import type { FormState } from '../../types/form';
import { getDegreeLabel, getResultLabel } from '../../utils/cvHelpers';
import { fitFontSize, textWidthEm } from '../../utils/fitText';
import { formatDateRange } from '../../utils/formatDate';
import { stripHtml } from '../../utils/stripHtml';

const colors = {
  primary: '#6c3ce0',
  sidebarBg: '#6c3ce0',
  sidebarText: '#ffffff',
  sidebarMuted: '#d4c4f7',
  mainText: '#1e293b',
  mainMuted: '#64748b',
};

const SIDEBAR_WIDTH = 190;
const SIDEBAR_PADDING = 20;

const s = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: colors.mainText,
    lineHeight: 1.22,
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: colors.sidebarBg,
    color: colors.sidebarText,
    padding: SIDEBAR_PADDING,
  },
  photo: { width: 58, height: 58, borderRadius: 29, alignSelf: 'center', marginBottom: 6 },
  nameBlock: { marginBottom: 5 },
  name: {
    color: colors.sidebarText,
    textAlign: 'center' as const,
    lineHeight: 1.25,
  },
  subtitle: {
    fontSize: 8,
    color: colors.sidebarMuted,
    textAlign: 'center' as const,
    lineHeight: 1.25,
    marginBottom: 2,
  },
  sidebarSection: { marginBottom: 9 },
  sidebarTitle: {
    fontSize: 7.5,
    fontWeight: 'bold' as const,
    color: colors.sidebarText,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    marginBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.25)',
    paddingBottom: 1.5,
  },
  contactItem: { fontSize: 7, color: colors.sidebarMuted, lineHeight: 1.2, marginBottom: 1 },
  skillTag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    fontSize: 7,
    color: colors.sidebarText,
    marginBottom: 2,
  },
  main: { flex: 1, padding: 18 },
  sectionTitle: {
    fontSize: 9.5,
    fontWeight: 'bold' as const,
    color: colors.primary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    marginBottom: 4,
    marginTop: 7,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingBottom: 1.5,
  },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 0.5 },
  bold: { fontWeight: 'bold' as const },
  italic: { fontSize: 7.5, color: colors.mainMuted, lineHeight: 1.2 },
  text: { fontSize: 8.5, color: colors.mainText, lineHeight: 1.22 },
  textSmall: { fontSize: 7.5, color: colors.mainMuted, lineHeight: 1.2 },
  role: { fontSize: 9, fontWeight: 'bold' as const, color: colors.mainText },
  company: { fontSize: 8, color: colors.primary, marginBottom: 0.5 },
  meta: { fontSize: 7.5, color: colors.mainMuted, lineHeight: 1.2, marginBottom: 0.5 },
  labelValue: { fontSize: 7.5, color: colors.mainMuted, lineHeight: 1.2 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap' as const, gap: 3 },
  entry: { marginBottom: 5 },
  bulletRow: { flexDirection: 'row', marginBottom: 0.5 },
  bullet: { width: 7, fontSize: 8, color: colors.primary, lineHeight: 1.22 },
  bulletText: { flex: 1, fontSize: 8.5, color: colors.mainText, lineHeight: 1.22 },
});

type RichBlock = { type: 'bullet' | 'text'; text: string };

const decodeEntities = (value: string) =>
  value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Flattens rich text into ordered blocks, keeping paragraphs and list items in
 * their original order. `htmlToBullets` cannot be used here because it drops
 * any paragraph that sits outside a list.
 */
function parseRichText(html: string): RichBlock[] {
  if (!html || !html.trim()) return [];
  const blocks: RichBlock[] = [];

  const listRe = /<(ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi;
  let cursor = 0;
  let listMatch: RegExpExecArray | null;

  const pushParagraphs = (chunk: string) => {
    if (!chunk.trim()) return;
    const parts = chunk
      .split(/<\/?(?:p|div|h[1-6])\b[^>]*>/gi)
      .map((p) => decodeEntities(p))
      .filter(Boolean);
    if (parts.length === 0) {
      const loose = decodeEntities(chunk);
      if (loose) blocks.push({ type: 'text', text: loose });
      return;
    }
    for (const part of parts) blocks.push({ type: 'text', text: part });
  };

  while ((listMatch = listRe.exec(html)) !== null) {
    pushParagraphs(html.slice(cursor, listMatch.index));
    const items = listMatch[2].match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    for (const item of items) {
      const text = decodeEntities(item);
      if (text) blocks.push({ type: 'bullet', text });
    }
    cursor = listMatch.index + listMatch[0].length;
  }
  pushParagraphs(html.slice(cursor));

  return blocks;
}

/**
 * Renders rich-text content compactly: one tight row per bullet and one
 * flowing line per paragraph, with no blank gaps between blocks.
 */
const RichText: React.FC<{ html?: string }> = ({ html }) => {
  const blocks = parseRichText(html ?? '');
  if (blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, i) =>
        block.type === 'bullet' ? (
          <View key={i} style={s.bulletRow}>
            <Text style={s.bullet}>•</Text>
            <Text style={s.bulletText}>{block.text}</Text>
          </View>
        ) : (
          <Text key={i} style={s.text}>
            {block.text}
          </Text>
        )
      )}
    </>
  );
};

/**
 * Splits a long name across lines that each fit the available width so the
 * name never overflows the sidebar or collides with the subtitle.
 */
function wrapName(name: string, maxWidth: number, fontSize: number): string[] {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && textWidthEm(candidate) * fontSize > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

const CVTemplateCreative: React.FC<{ formState: FormState }> = ({ formState }) => {
  const { data, selectedSections } = formState;
  const {
    personalData: pd,
    introduction,
    educations,
    experiences,
    projects,
    skills,
    credentials,
    certifications,
    languages,
    references,
    medicalScience,
  } = data;

  const shouldShow = (section: keyof typeof selectedSections) =>
    selectedSections[section] !== false;

  const contentWidth = SIDEBAR_WIDTH - SIDEBAR_PADDING * 2;
  const fullName = pd.fullName || 'Your Name';
  // Shrink toward a readable floor, then wrap across lines if still too wide.
  const nameFontSize = fitFontSize(fullName, contentWidth, 18, 12);
  const nameLines = wrapName(fullName, contentWidth, nameFontSize);

  const technicalSkills = skills.flatMap((sk) =>
    (sk.technicalSkills || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  );
  const softSkills = skills
    .flatMap((sk) => (sk.softSkills || '').split(',').map((t) => t.trim()))
    .filter(Boolean);
  const spokenFromSkills = skills
    .flatMap((sk) => (sk.spokenLanguages || '').split(',').map((t) => t.trim()))
    .filter(Boolean);
  const yearsExperience = skills.map((sk) => sk.yearsOfExperience).find((y) => y && y > 0);
  const proficiency = skills.map((sk) => sk.proficiencyLevel).find((p) => p && p !== 'beginner');
  const languagesList = languages.length
    ? languages.map((l) => `${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}`)
    : spokenFromSkills;
  const extraCredentials = credentials.filter(
    (c) => c.volunteerWork || c.militaryService || c.securityClearance || c.hobbies || c.references
  );
  // Certificates from both the credentials and certifications steps are merged
  // into one sidebar list so nothing is rendered twice.
  const credentialBlocks = [
    ...credentials.map((c) => ({
      id: c.id,
      title: c.certificateName,
      subtitle: c.issuer,
      credentialId: c.credentialId,
    })),
    ...certifications.map((c) => ({
      id: `cert-${c.id}`,
      title: c.name,
      subtitle: c.issuer,
      credentialId: c.credentialId,
    })),
  ].filter((item) => item.title);

  const contactExtras = [
    pd.nationality ? `Nationality: ${pd.nationality}` : '',
    pd.visaStatus ? `Visa: ${pd.visaStatus}` : '',
    pd.dateOfBirth ? `DOB: ${pd.dateOfBirth}` : '',
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.sidebar}>
          {shouldShow('personalData') && (
            <>
              {pd.profilePhotoUrl && <Image style={s.photo} src={pd.profilePhotoUrl} />}
              <View style={s.nameBlock}>
                {nameLines.map((line, i) => (
                  <Text key={`${line}-${i}`} style={[s.name, { fontSize: nameFontSize }]}>
                    {line}
                  </Text>
                ))}
              </View>
              {introduction.targetJobTitles && introduction.targetJobTitles.trim() && (
                <Text style={s.subtitle}>{introduction.targetJobTitles}</Text>
              )}

              <View style={s.sidebarSection}>
                <Text style={s.sidebarTitle}>Contact</Text>
                {pd.email && <Text style={s.contactItem}>{pd.email}</Text>}
                {pd.phone && <Text style={s.contactItem}>{pd.phone}</Text>}
                {(pd.city || pd.country) && (
                  <Text style={s.contactItem}>
                    {pd.city}
                    {pd.city && pd.country ? ', ' : ''}
                    {pd.country}
                  </Text>
                )}
                {pd.linkedin && <Text style={s.contactItem}>{pd.linkedin}</Text>}
                {contactExtras.map((line) => (
                  <Text key={line} style={s.contactItem}>
                    {line}
                  </Text>
                ))}
                {pd.customSocialLinks.map((link) => (
                  <Text key={link.id} style={s.contactItem}>
                    {link.label ? `${link.label}: ` : ''}
                    {link.url}
                  </Text>
                ))}
              </View>
            </>
          )}

          {shouldShow('skills') && technicalSkills.length > 0 && (
            <View style={s.sidebarSection}>
              <Text style={s.sidebarTitle}>Skills</Text>
              <View style={s.skillsRow}>
                {technicalSkills.map((skill, i) => (
                  <Text key={`${skill}-${i}`} style={s.skillTag}>
                    {skill}
                  </Text>
                ))}
              </View>
              {softSkills.length > 0 && (
                <Text style={s.contactItem}>Soft: {softSkills.join(', ')}</Text>
              )}
              {(yearsExperience || proficiency) && (
                <Text style={s.contactItem}>
                  {yearsExperience ? `${yearsExperience}+ yrs experience` : ''}
                  {yearsExperience && proficiency ? ' — ' : ''}
                  {proficiency || ''}
                </Text>
              )}
            </View>
          )}

          {shouldShow('languages') && languagesList.length > 0 && (
            <View style={s.sidebarSection}>
              <Text style={s.sidebarTitle}>Languages</Text>
              {languagesList.map((lang, i) => (
                <Text key={`${lang}-${i}`} style={s.contactItem}>
                  {lang}
                </Text>
              ))}
            </View>
          )}

          {shouldShow('credentials') && credentialBlocks.length > 0 && (
            <View style={s.sidebarSection}>
              <Text style={s.sidebarTitle}>Certifications</Text>
              {credentialBlocks.map((item) => (
                <View key={item.id} style={{ marginBottom: 3 }}>
                  <Text style={s.contactItem}>{item.title}</Text>
                  {item.subtitle && <Text style={s.contactItem}>{item.subtitle}</Text>}
                  {item.credentialId && <Text style={s.contactItem}>ID: {item.credentialId}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={s.main}>
          {shouldShow('introduction') &&
            (introduction.professionalSummary ||
              introduction.objectiveStatement ||
              introduction.keyCareerMilestones) && (
              <View>
                <Text style={s.sectionTitle}>Professional Summary</Text>
                <RichText html={introduction.professionalSummary} />
                {introduction.objectiveStatement && (
                  <Text style={s.textSmall}>
                    <Text style={s.bold}>Objective: </Text>
                    {stripHtml(introduction.objectiveStatement)}
                  </Text>
                )}
                {introduction.keyCareerMilestones && (
                  <Text style={s.textSmall}>
                    <Text style={s.bold}>Highlights: </Text>
                    {stripHtml(introduction.keyCareerMilestones)}
                  </Text>
                )}
              </View>
            )}

          {shouldShow('experiences') && experiences.length > 0 && (
            <View>
              <Text style={s.sectionTitle}>Experience</Text>
              {experiences.map((exp) => (
                <View key={exp.id} style={s.entry}>
                  <View style={s.entryHeader}>
                    <Text style={s.role}>{exp.position}</Text>
                    <Text style={s.italic}>
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </Text>
                  </View>
                  {exp.company && (
                    <Text style={s.company}>
                      {exp.company}
                      {exp.location ? ' | ' + exp.location : ''}
                    </Text>
                  )}
                  <RichText html={exp.description} />
                  {exp.achievements && <RichText html={exp.achievements} />}
                  {exp.toolsUsed && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Tools: </Text>
                      {stripHtml(exp.toolsUsed)}
                    </Text>
                  )}
                  {exp.directReports && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Direct reports: </Text>
                      {stripHtml(exp.directReports)}
                    </Text>
                  )}
                  {exp.reasonForLeaving && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Reason for leaving: </Text>
                      {stripHtml(exp.reasonForLeaving)}
                    </Text>
                  )}
                  {exp.salaryHistory && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Salary: </Text>
                      {stripHtml(exp.salaryHistory)}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {shouldShow('projects') && projects.length > 0 && (
            <View>
              <Text style={s.sectionTitle}>Projects</Text>
              {projects.map((proj) => (
                <View key={proj.id} style={s.entry}>
                  <View style={s.entryHeader}>
                    <Text style={s.role}>{proj.name}</Text>
                    <Text style={s.italic}>
                      {formatDateRange(proj.startDate, proj.endDate, proj.current)}
                    </Text>
                  </View>
                  {proj.role && <Text style={s.company}>{proj.role}</Text>}
                  <RichText html={proj.description} />
                  {proj.technicalArchitecture && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Architecture: </Text>
                      {stripHtml(proj.technicalArchitecture)}
                    </Text>
                  )}
                  {(proj.codeRepositoryUrl || proj.liveDemoUrl) && (
                    <Text style={s.labelValue}>
                      {[proj.codeRepositoryUrl, proj.liveDemoUrl].filter(Boolean).join(' | ')}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {shouldShow('educations') && educations.length > 0 && (
            <View>
              <Text style={s.sectionTitle}>Education</Text>
              {educations.map((edu) => (
                <View key={edu.id} style={s.entry}>
                  <View style={s.entryHeader}>
                    <Text style={s.role}>
                      {getDegreeLabel(edu.degree)}
                      {edu.fieldOfStudy ? `: ${edu.fieldOfStudy}` : ''}
                    </Text>
                    <Text style={s.italic}>
                      {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                    </Text>
                  </View>
                  {edu.institution && <Text style={s.company}>{edu.institution}</Text>}
                  {edu.location && <Text style={s.meta}>{edu.location}</Text>}
                  {edu.gpa && (
                    <Text style={s.textSmall}>{getResultLabel(edu.resultType, edu.gpa)}</Text>
                  )}
                  <RichText html={edu.description} />
                  {edu.thesisTopic && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Thesis: </Text>
                      {stripHtml(edu.thesisTopic)}
                    </Text>
                  )}
                  {edu.academicHonors && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Honors: </Text>
                      {stripHtml(edu.academicHonors)}
                    </Text>
                  )}
                  {edu.relevantClasses && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Coursework: </Text>
                      {stripHtml(edu.relevantClasses)}
                    </Text>
                  )}
                  {edu.classRank && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Rank: </Text>
                      {stripHtml(edu.classRank)}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {shouldShow('credentials') && extraCredentials.length > 0 && (
            <View>
              <Text style={s.sectionTitle}>Additional</Text>
              {extraCredentials.map((cred) => (
                <View key={cred.id} style={{ marginBottom: 3 }}>
                  {cred.volunteerWork && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Volunteer: </Text>
                      {stripHtml(cred.volunteerWork)}
                    </Text>
                  )}
                  {cred.militaryService && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Military: </Text>
                      {stripHtml(cred.militaryService)}
                    </Text>
                  )}
                  {cred.securityClearance && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Security clearance: </Text>
                      {stripHtml(cred.securityClearance)}
                    </Text>
                  )}
                  {cred.hobbies && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Interests: </Text>
                      {stripHtml(cred.hobbies)}
                    </Text>
                  )}
                  {cred.references && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>References: </Text>
                      {stripHtml(cred.references)}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {shouldShow('medicalScience') && medicalScience.length > 0 && (
            <View>
              <Text style={s.sectionTitle}>Medical & Science</Text>
              {medicalScience.map((ms) => (
                <View key={ms.id} style={{ marginBottom: 3 }}>
                  {ms.clinicalRotations && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Clinical rotations: </Text>
                      {stripHtml(ms.clinicalRotations)}
                    </Text>
                  )}
                  {ms.researchGrants && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Research grants: </Text>
                      {stripHtml(ms.researchGrants)}
                    </Text>
                  )}
                  {ms.publications && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Publications: </Text>
                      {stripHtml(ms.publications)}
                    </Text>
                  )}
                  {ms.medicalLicenses && (
                    <Text style={s.labelValue}>
                      <Text style={s.bold}>Licenses: </Text>
                      {stripHtml(ms.medicalLicenses)}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {shouldShow('references') && references.length > 0 && (
            <View>
              <Text style={s.sectionTitle}>References</Text>
              {references.map((ref) => (
                <Text key={ref.id} style={s.labelValue}>
                  <Text style={s.bold}>{ref.name}</Text>
                  {ref.title || ref.company
                    ? ` — ${[ref.title, ref.company].filter(Boolean).join(', ')}`
                    : ''}
                  {ref.email ? ` • ${ref.email}` : ''}
                  {ref.phone ? ` • ${ref.phone}` : ''}
                </Text>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default CVTemplateCreative;
