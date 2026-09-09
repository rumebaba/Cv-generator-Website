import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import React from 'react';

import type { FormState } from '../../types/form';
import { stripHtml } from '../../utils/stripHtml';
import { getDegreeLabel, getResultLabel } from '../../utils/cvHelpers';

const styles = StyleSheet.create({
  page: { flexDirection: 'row', fontFamily: 'Helvetica', fontSize: 9, color: '#333', lineHeight: 1.4 },
  sidebar: { width: 180, backgroundColor: '#6c3ce0', color: '#ffffff', padding: 20 },
  photo: { width: 60, height: 60, borderRadius: 30, alignSelf: 'center', marginBottom: 10 },
  name: { fontSize: 18, fontWeight: 'bold' as const, color: '#ffffff', textAlign: 'center' as const },
  subtitle: { fontSize: 9, color: '#d4c4f7', marginTop: 4, textAlign: 'center' as const },
  sidebarSection: { marginBottom: 16 },
  sidebarTitle: { fontSize: 9, fontWeight: 'bold' as const, color: '#d4c4f7', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)', paddingBottom: 3 },
  contactItem: { fontSize: 8, color: '#e0d4f7', marginBottom: 3 },
  skillTag: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3, paddingHorizontal: 6, paddingVertical: 2, fontSize: 8, color: '#ffffff', marginBottom: 2 },
  main: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold' as const, color: '#6c3ce0', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#6c3ce0', paddingBottom: 3 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  bold: { fontWeight: 'bold' as const },
  italic: { fontFamily: 'Helvetica-Oblique', fontSize: 9, color: '#666' },
  desc: { lineHeight: 1.5, marginBottom: 6, marginTop: 2 },
  text: { fontSize: 9, color: '#334155' },
  textSmall: { fontSize: 8, color: '#64748b' },
  role: { fontSize: 10, fontWeight: 'bold' as const, color: '#1e293b' },
  company: { fontSize: 9, color: '#6c3ce0', marginBottom: 1 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap' as const, gap: 4 },
});

const CVTemplateCreative: React.FC<{ formState: FormState }> = ({ formState }) => {
  const { data } = formState;
  const { personalData: pd, introduction, educations, experiences, projects, skills, credentials, medicalScience } = data;

  const formatEnd = (current: boolean, endDate: string) => {
    if (current) return 'Present';
    if (endDate) return new Date(endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
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
            {(pd.city || pd.country) && <Text style={styles.contactItem}>{pd.city}{pd.city && pd.country ? ', ' : ''}{pd.country}</Text>}
            {pd.linkedin && <Text style={styles.contactItem}>{pd.linkedin}</Text>}
          </View>

          {skills && skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Skills</Text>
              {skills.map((skill) => (
                <View key={skill.id} style={{ marginBottom: 8 }}>
                  {skill.technicalSkills && skill.technicalSkills.trim() && (
                    <View style={styles.skillsRow}>
                      {skill.technicalSkills.split(',').map((s, i) => (
                        <Text key={i} style={styles.skillTag}>{s.trim()}</Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {credentials && credentials.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Certifications</Text>
              {credentials.map((cred) => (
                <Text key={cred.id} style={styles.contactItem}>{cred.certificateName}</Text>
              ))}
            </View>
          )}
        </View>

        <View style={styles.main}>
          {introduction.professionalSummary && introduction.professionalSummary.trim() && (
            <View style={{ marginBottom: 14 }}>
              <Text style={styles.sectionTitle}>Professional Summary</Text>
              <Text style={styles.text}>{stripHtml(introduction.professionalSummary)}</Text>
            </View>
          )}

          {experiences && experiences.length > 0 && (
            <View style={{ marginBottom: 14 }}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {experiences.map((exp) => (
                <View key={exp.id} style={{ marginBottom: 8 }}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.role}>{exp.position}</Text>
                    <Text style={styles.italic}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate ? formatEnd(exp.current, exp.endDate) : ''}</Text>
                  </View>
                  <Text style={styles.company}>{exp.company}{exp.location ? ' | ' + exp.location : ''}</Text>
                  {exp.achievements && exp.achievements.trim() && (
                    <>
                      {stripHtml(exp.achievements).split('\n').filter(Boolean).map((line, i) => (
                        <Text key={i} style={{ marginLeft: 8, fontSize: 9 }}>• {line.trim()}</Text>
                      ))}
                    </>
                  )}
                  {exp.description && exp.description.trim() && (
                    <Text style={styles.desc}>{stripHtml(exp.description)}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {educations && educations.length > 0 && (
            <View style={{ marginBottom: 14 }}>
              <Text style={styles.sectionTitle}>Education</Text>
              {educations.map((edu) => (
                <View key={edu.id} style={{ marginBottom: 6 }}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.bold}>{getDegreeLabel(edu.degree)}{edu.fieldOfStudy ? ': ' + edu.fieldOfStudy : ''}</Text>
                    <Text style={styles.italic}>{edu.startDate} — {edu.current ? 'Present' : edu.endDate ? formatEnd(edu.current, edu.endDate) : ''}</Text>
                  </View>
                  {edu.institution && <Text style={styles.company}>{edu.institution}</Text>}
                  {edu.gpa && edu.gpa.trim() && <Text style={styles.textSmall}>{getResultLabel(edu.resultType, edu.gpa)}</Text>}
                </View>
              ))}
            </View>
          )}

          {projects && projects.length > 0 && (
            <View style={{ marginBottom: 14 }}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {projects.map((pr) => (
                <View key={pr.id} style={{ marginBottom: 6 }}>
                  <Text style={styles.bold}>{pr.name}</Text>
                  {pr.role && <Text style={styles.company}>{pr.role}</Text>}
                  <Text style={styles.desc}>{stripHtml(pr.description)}</Text>
                </View>
              ))}
            </View>
          )}

          {medicalScience && medicalScience.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Medical & Science</Text>
              {medicalScience.map((ms) => (
                <View key={ms.id} style={{ marginBottom: 6 }}>
                  {ms.clinicalRotations && ms.clinicalRotations.trim() && <Text style={styles.text}>Clinical Rotations: {ms.clinicalRotations}</Text>}
                  {ms.researchGrants && ms.researchGrants.trim() && <Text style={styles.text}>Research Grants: {ms.researchGrants}</Text>}
                  {ms.publications && ms.publications.trim() && <Text style={styles.text}>Publications: {ms.publications}</Text>}
                  {ms.medicalLicenses && ms.medicalLicenses.trim() && <Text style={styles.text}>Licenses: {ms.medicalLicenses}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default CVTemplateCreative;
