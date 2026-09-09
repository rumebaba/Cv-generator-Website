import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import React from 'react';

import type { FormState } from '../../types/form';
import { stripHtml } from '../../utils/stripHtml';
import { getDegreeLabel, getResultLabel } from '../../utils/cvHelpers';

const colors = { primary: '#2563eb', dark: '#1e293b', gray: '#64748b', light: '#f1f5f9' };

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: colors.dark },
  header: { marginBottom: 16 },
  photo: { width: 60, height: 60, borderRadius: 30, alignSelf: 'center', marginBottom: 8 },
  name: { fontSize: 26, fontFamily: 'Helvetica-Bold', color: colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 10, textAlign: 'center', color: colors.gray, marginBottom: 8 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, fontSize: 9, color: colors.gray },
  summary: { marginBottom: 16, lineHeight: 1.5, color: colors.gray },
  sectionTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: colors.primary, borderBottomWidth: 1, borderBottomColor: colors.primary, paddingBottom: 3, marginBottom: 8, marginTop: 12, textTransform: 'uppercase', letterSpacing: 1 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  entryTitle: { fontFamily: 'Helvetica-Bold', fontSize: 11 },
  entrySubtitle: { fontSize: 9, color: colors.gray },
  entryDesc: { lineHeight: 1.5, marginBottom: 8, color: colors.dark },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillChip: { backgroundColor: colors.light, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, fontSize: 9, color: colors.dark, marginBottom: 2 },
  projectName: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
});

const CVTemplateModern: React.FC<{ formState: FormState }> = ({ formState }) => {
  const { data } = formState;
  const { personalData: pd, introduction, educations, experiences, projects, skills } = data;

  const formatEnd = (current: boolean, endDate: string) => {
    if (current) return 'Present';
    if (endDate) return new Date(endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return 'Present';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {pd.profilePhotoUrl && <Image style={styles.photo} src={pd.profilePhotoUrl} />}
        <View style={styles.header}>
          <Text style={styles.name}>{pd.fullName || 'Your Name'}</Text>
          {introduction.targetJobTitles && introduction.targetJobTitles.trim() && (
            <Text style={styles.subtitle}>{introduction.targetJobTitles}</Text>
          )}
          <View style={styles.contactRow}>
            {pd.email && <Text>{pd.email}</Text>}
            {pd.phone && <Text>{pd.phone}</Text>}
            {(pd.city || pd.country) && <Text>{pd.city}{pd.city && pd.country ? ', ' : ''}{pd.country}</Text>}
          </View>
        </View>

        {introduction.professionalSummary && introduction.professionalSummary.trim() && (
          <Text style={styles.summary}>{stripHtml(introduction.professionalSummary)}</Text>
        )}

        {experiences && experiences.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 8 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{exp.position} — {exp.company}</Text>
                  <Text style={styles.entrySubtitle}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate ? formatEnd(exp.current, exp.endDate) : ''}</Text>
                </View>
                <Text style={styles.entryDesc}>{stripHtml(exp.description)}</Text>
              </View>
            ))}
          </View>
        )}

        {educations && educations.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {educations.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 6 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{getDegreeLabel(edu.degree)} {edu.fieldOfStudy} — {edu.institution}</Text>
                  <Text style={styles.entrySubtitle}>{edu.startDate} — {edu.current ? 'Present' : edu.endDate ? formatEnd(edu.current, edu.endDate) : ''}</Text>
                </View>
                {edu.gpa && edu.gpa.trim() && <Text style={styles.entrySubtitle}>{getResultLabel(edu.resultType, edu.gpa)}</Text>}
              </View>
            ))}
          </View>
        )}

        {skills && skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsRow}>
              {skills.map((skill) => (
                <React.Fragment key={skill.id}>
                  {skill.technicalSkills && skill.technicalSkills.trim() && (
                    skill.technicalSkills.split(',').map((s, i) => (
                      <Text key={i} style={styles.skillChip}>{s.trim()}</Text>
                    ))
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        )}

        {projects && projects.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((pr) => (
              <View key={pr.id} style={{ marginBottom: 6 }}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <Text style={styles.projectName}>{pr.name}</Text>
                </View>
                <Text style={{ fontSize: 9, color: colors.gray, marginBottom: 2 }}>{pr.role}</Text>
                <Text style={styles.entryDesc}>{stripHtml(pr.description)}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CVTemplateModern;
