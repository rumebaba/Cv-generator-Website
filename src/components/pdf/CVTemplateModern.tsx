import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import React from 'react';

import type { FormState } from '../../types/form';
import { getDegreeLabel, getResultLabel, htmlToBullets } from '../../utils/cvHelpers';
import { formatDateRange } from '../../utils/formatDate';
import { stripHtml } from '../../utils/stripHtml';

const colors = {
  primary: '#2563eb',
  dark: '#1e293b',
  gray: '#64748b',
  light: '#f1f5f9',
  white: '#ffffff',
};

const styles = StyleSheet.create({
  page: { flexDirection: 'row', fontFamily: 'Helvetica', fontSize: 9, color: colors.dark },
  sidebar: { width: 180, backgroundColor: colors.dark, color: colors.white, padding: 20 },
  photo: { width: 60, height: 60, borderRadius: 30, alignSelf: 'center', marginBottom: 12 },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center' as const,
    marginBottom: 4,
  },
  subtitle: { fontSize: 9, color: '#94a3b8', textAlign: 'center' as const, marginBottom: 16 },
  sidebarSection: { marginBottom: 16 },
  sidebarTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    paddingBottom: 3,
  },
  contactItem: { fontSize: 7.5, color: '#94a3b8', marginBottom: 3 },
  skillChip: {
    backgroundColor: 'rgba(37,99,235,0.2)',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 7.5,
    color: colors.white,
    marginBottom: 2,
  },
  main: { flex: 1, padding: 24 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingBottom: 3,
  },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  entryTitle: { fontWeight: 'bold', fontSize: 10, color: colors.dark },
  entrySubtitle: { fontSize: 8, color: colors.gray },
  entryDesc: { lineHeight: 1.5, marginBottom: 8, color: colors.dark },
  projectName: { fontWeight: 'bold', fontSize: 9.5 },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap' as const, gap: 4 },
  skillTagMain: {
    backgroundColor: colors.light,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 8,
    color: colors.dark,
    marginBottom: 2,
  },
});

const CVTemplateModern: React.FC<{ formState: FormState }> = ({ formState }) => {
  const { data, selectedSections } = formState;
  const { personalData: pd, introduction, educations, experiences, projects, skills } = data;

  const shouldShow = (section: keyof typeof selectedSections) => selectedSections[section] !== false;

  const formatEnd = (current: boolean, endDate: string) => {
    if (current) return 'Present';
    if (endDate)
      return new Date(endDate + '-01').toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    return 'Present';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          {pd.profilePhotoUrl && <Image style={styles.photo} src={pd.profilePhotoUrl} />}
          <Text style={styles.name}>{pd.fullName || 'Your Name'}</Text>
          {introduction.targetJobTitles && introduction.targetJobTitles.trim() && (
            <Text style={styles.subtitle}>{introduction.targetJobTitles}</Text>
          )}

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>Contact</Text>
            {pd.email && <Text style={styles.contactItem}>{pd.email}</Text>}
            {pd.phone && <Text style={styles.contactItem}>{pd.phone}</Text>}
            {(pd.city || pd.country) && (
              <Text style={styles.contactItem}>
                {pd.city}
                {pd.city && pd.country ? ', ' : ''}
                {pd.country}
              </Text>
            )}
            {pd.linkedin && <Text style={styles.contactItem}>{pd.linkedin}</Text>}
          </View>

          {shouldShow('skills') && skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Skills</Text>
              {skills.map((skill) => (
                <View key={skill.id} style={{ marginBottom: 8 }}>
                  {skill.technicalSkills && skill.technicalSkills.trim() && (
                    <View style={styles.skillRow}>
                      {skill.technicalSkills.split(',').map((s, i) => (
                        <Text key={i} style={styles.skillChip}>
                          {s.trim()}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {shouldShow('educations') && educations.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Education</Text>
              {educations.map((edu) => (
                <Text key={edu.id} style={styles.contactItem}>
                  {getDegreeLabel(edu.degree)}
                  {edu.fieldOfStudy ? ': ' + edu.fieldOfStudy : ''} — {edu.institution}
                </Text>
              ))}
            </View>
          )}
        </View>

        <View style={styles.main}>
          {shouldShow('introduction') && introduction.professionalSummary && introduction.professionalSummary.trim() && (
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <Text style={{ lineHeight: 1.5, color: colors.gray }}>
                {stripHtml(introduction.professionalSummary)}
              </Text>
            </View>
          )}

          {shouldShow('experiences') && experiences.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {experiences.map((exp) => (
                <View key={exp.id} style={{ marginBottom: 10 }}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>
                      {exp.position} — {exp.company}
                    </Text>
                    <Text style={styles.entrySubtitle}>
                      {exp.startDate} —{' '}
                      {exp.current
                        ? 'Present'
                        : exp.endDate
                          ? formatEnd(exp.current, exp.endDate)
                          : ''}
                      {exp.location && ` | ${exp.location}`}
                    </Text>
                  </View>
                  <Text style={styles.entryDesc}>{stripHtml(exp.description)}</Text>
                  {exp.achievements &&
                    htmlToBullets(exp.achievements).map((b, j) => (
                      <Text
                        key={j}
                        style={{
                          marginLeft: 12,
                          fontSize: 8.5,
                          color: colors.gray,
                          marginBottom: 2,
                        }}
                      >
                        • {b}
                      </Text>
                    ))}
                </View>
              ))}
            </View>
          )}

          {shouldShow('projects') && projects.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {projects.map((pr) => (
                <View key={pr.id} style={{ marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <Text style={styles.projectName}>{pr.name}</Text>
                  </View>
                  {pr.role && (
                    <Text style={{ fontSize: 8.5, color: colors.gray, marginBottom: 3 }}>
                      {pr.role}
                    </Text>
                  )}
                  <Text style={styles.entryDesc}>{stripHtml(pr.description)}</Text>
                </View>
              ))}
            </View>
          )}

          {shouldShow('skills') && skills.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillRow}>
                {skills.map((skill) => (
                  <React.Fragment key={skill.id}>
                    {skill.technicalSkills &&
                      skill.technicalSkills.trim() &&
                      skill.technicalSkills.split(',').map((s, i) => (
                        <Text key={i} style={styles.skillTagMain}>
                          {s.trim()}
                        </Text>
                      ))}
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default CVTemplateModern;
