import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import React from 'react';

import type { FormState } from '../../types/form';
import { getDegreeLabel, getResultLabel, htmlToBullets } from '../../utils/cvHelpers';
import { formatDateRange } from '../../utils/formatDate';
import { stripHtml } from '../../utils/stripHtml';

const colors = {
  primary: '#6c3ce0',
  sidebarBg: '#6c3ce0',
  sidebarText: '#ffffff',
  sidebarMuted: '#d4c4f7',
  mainText: '#333',
  mainMuted: '#666',
};

const s = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: colors.mainText,
    lineHeight: 1.4,
  },
  sidebar: {
    width: 180,
    backgroundColor: colors.sidebarBg,
    color: colors.sidebarText,
    padding: 20,
  },
  photo: { width: 60, height: 60, borderRadius: 30, alignSelf: 'center', marginBottom: 10 },
  name: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: colors.sidebarText,
    textAlign: 'center' as const,
  },
  subtitle: { fontSize: 9, color: colors.sidebarMuted, marginTop: 4, textAlign: 'center' as const },
  sidebarSection: { marginBottom: 16 },
  sidebarTitle: {
    fontSize: 9,
    fontWeight: 'bold' as const,
    color: colors.sidebarMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    paddingBottom: 3,
  },
  contactItem: { fontSize: 7.5, color: colors.sidebarMuted, marginBottom: 3 },
  skillTag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 7.5,
    color: colors.sidebarText,
    marginBottom: 2,
  },
  main: { flex: 1, padding: 20 },
  section: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold' as const,
    color: colors.primary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingBottom: 3,
  },
  row: { flexDirection: 'row', marginBottom: 6 },
  rowLeft: { flex: 1 },
  rowRight: { width: 90, textAlign: 'right' as const, fontSize: 7.5, color: colors.mainMuted },
  title: { fontSize: 9, fontWeight: 'bold' as const, color: colors.mainText },
  sub: { fontSize: 8, color: colors.mainMuted, fontStyle: 'italic' as const },
  text: { fontSize: 8.5, color: colors.mainText, marginTop: 2 },
  textSmall: { fontSize: 7.5, color: colors.mainMuted, marginTop: 1 },
  inline: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  pill: {
    backgroundColor: 'rgba(108, 60, 224, 0.1)',
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    fontSize: 7.5,
    color: colors.primary,
    marginBottom: 2,
  },
  compactEntry: { marginBottom: 6 },
  bulletRow: { flexDirection: 'row', marginBottom: 2 },
  bullet: { width: 10, fontSize: 8, color: colors.primary },
  bulletText: { flex: 1, fontSize: 8.5, color: colors.mainText },
});

const CVTemplateCreative: React.FC<{ formState: FormState }> = ({ formState }) => {
  const { data } = formState;
  const {
    personalData: pd,
    introduction,
    educations,
    experiences,
    projects,
    skills,
    credentials,
    references,
  } = data;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.sidebar}>
          {pd.profilePhotoUrl && <Image style={s.photo} src={pd.profilePhotoUrl} />}
          <Text style={s.name}>{pd.fullName}</Text>
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
          </View>

          {skills.length > 0 && (
            <View style={s.sidebarSection}>
              <Text style={s.sidebarTitle}>Skills</Text>
              {skills.map((skill) => (
                <View key={skill.id} style={{ marginBottom: 8 }}>
                  {skill.technicalSkills && skill.technicalSkills.trim() && (
                    <View style={s.inline}>
                      {skill.technicalSkills.split(',').map((skillText, i) => (
                        <Text key={i} style={s.skillTag}>
                          {skillText.trim()}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {credentials.length > 0 && (
            <View style={s.sidebarSection}>
              <Text style={s.sidebarTitle}>Certifications</Text>
              {credentials.map((cred) => (
                <Text key={cred.id} style={s.contactItem}>
                  {cred.certificateName}
                </Text>
              ))}
            </View>
          )}

          {references.length > 0 && (
            <View style={s.sidebarSection}>
              <Text style={s.sidebarTitle}>References</Text>
              {references.map((ref) => (
                <Text key={ref.id} style={s.contactItem}>
                  {ref.name} ({ref.title})
                </Text>
              ))}
            </View>
          )}
        </View>

        <View style={s.main}>
          {/* Summary */}
          {introduction.professionalSummary && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Professional Summary</Text>
              <Text style={s.text}>{stripHtml(introduction.professionalSummary)}</Text>
            </View>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Experience</Text>
              {experiences.map((exp) => (
                <View key={exp.id} style={s.compactEntry}>
                  <View style={s.row}>
                    <View style={s.rowLeft}>
                      <Text style={s.title}>{exp.position}</Text>
                      {exp.company && (
                        <Text style={s.sub}>
                          {exp.company}
                          {exp.location ? ' | ' + exp.location : ''}
                        </Text>
                      )}
                    </View>
                    <Text style={s.rowRight}>
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </Text>
                  </View>
                  {exp.achievements &&
                    htmlToBullets(exp.achievements).map((b, j) => (
                      <View key={j} style={s.bulletRow}>
                        <Text style={s.bullet}>•</Text>
                        <Text style={s.bulletText}>{b}</Text>
                      </View>
                    ))}
                  {exp.description && <Text style={s.text}>{stripHtml(exp.description)}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {educations.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Education</Text>
              {educations.map((edu) => (
                <View key={edu.id} style={s.compactEntry}>
                  <View style={s.row}>
                    <View style={s.rowLeft}>
                      <Text style={s.title}>
                        {getDegreeLabel(edu.degree)}
                        {edu.fieldOfStudy ? ': ' + edu.fieldOfStudy : ''}
                      </Text>
                      {edu.institution && <Text style={s.sub}>{edu.institution}</Text>}
                    </View>
                    <Text style={s.rowRight}>
                      {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                    </Text>
                  </View>
                  {edu.gpa && (
                    <Text style={s.textSmall}>{getResultLabel(edu.resultType, edu.gpa)}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Projects</Text>
              {projects.map((proj) => (
                <View key={proj.id} style={s.compactEntry}>
                  <View style={s.row}>
                    <View style={s.rowLeft}>
                      <Text style={s.title}>{proj.name}</Text>
                      {proj.role && <Text style={s.sub}>{proj.role}</Text>}
                    </View>
                    <Text style={s.rowRight}>
                      {formatDateRange(proj.startDate, proj.endDate, proj.current)}
                    </Text>
                  </View>
                  {proj.description && <Text style={s.text}>{stripHtml(proj.description)}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Credentials */}
          {credentials.length > 0 && credentials.some((c) => c.certificateName) && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Certifications</Text>
              <View style={s.inline}>
                {credentials
                  .filter((c) => c.certificateName)
                  .map((cred) => (
                    <Text key={cred.id} style={s.pill}>
                      {cred.certificateName} ({cred.issuer})
                      {cred.dateIssued ? ` - ${cred.dateIssued}` : ''}
                    </Text>
                  ))}
              </View>
            </View>
          )}

          {/* Languages */}
          {skills.length > 0 && skills.some((sk) => sk.spokenLanguages) && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Languages</Text>
              <Text style={s.text}>
                {skills
                  .filter((sk) => sk.spokenLanguages)
                  .map((sk) => sk.spokenLanguages)
                  .join(', ')}
              </Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default CVTemplateCreative;
