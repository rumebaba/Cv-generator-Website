import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import React from 'react';

import type { FormState } from '../../types/form';
import { stripHtml } from '../../utils/stripHtml';
import { getDegreeLabel, getResultLabel } from '../../utils/cvHelpers';

const styles = StyleSheet.create({
  page: { padding: 35, fontFamily: 'Helvetica', fontSize: 10, color: '#1a1a2e', lineHeight: 1.5 },
  header: { backgroundColor: '#1a1a2e', padding: 30, marginBottom: 20, textAlign: 'center' as const },
  photo: { width: 65, height: 65, borderRadius: 33, alignSelf: 'center', marginBottom: 10 },
  name: { fontSize: 22, fontWeight: 'bold' as const, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#c9a84c' },
  subtitle: { fontSize: 10, color: '#b0b0b0', marginTop: 4, letterSpacing: 1 },
  contact: { fontSize: 8, color: '#999', marginTop: 8, textAlign: 'center' as const },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold' as const, color: '#1a1a2e', textTransform: 'uppercase' as const, borderBottomWidth: 1, borderBottomColor: '#c9a84c', paddingBottom: 4, marginBottom: 8, letterSpacing: 1 },
  text: { fontSize: 9, color: '#333', marginBottom: 4 },
  textSmall: { fontSize: 8, color: '#666' },
  role: { fontSize: 10, fontWeight: 'bold' as const, color: '#1a1a2e', marginBottom: 2 },
  company: { fontSize: 9, color: '#4f46e5', marginBottom: 1 },
  dateLocation: { fontSize: 8, color: '#666', marginBottom: 3 },
  skillTag: { backgroundColor: '#f0e6d2', borderRadius: 2, paddingHorizontal: 8, paddingVertical: 3, fontSize: 8, color: '#1a1a2e', marginBottom: 2 },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap' as const, gap: 4 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  bold: { fontWeight: 'bold' as const },
  italic: { fontFamily: 'Helvetica-Oblique', fontSize: 9, color: '#666' },
  desc: { lineHeight: 1.5, marginBottom: 6, marginTop: 2 },
  bullet: { width: 8, fontSize: 9, color: '#c9a84c' },
});

const CVTemplateExecutive: React.FC<{ formState: FormState }> = ({ formState }) => {
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
        {pd.profilePhotoUrl && <Image style={styles.photo} src={pd.profilePhotoUrl} />}
        <View style={styles.header}>
          <Text style={styles.name}>{pd.fullName || 'Your Name'}</Text>
          {introduction.targetJobTitles && introduction.targetJobTitles.trim() && (
            <Text style={styles.subtitle}>{introduction.targetJobTitles}</Text>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {pd.email && <Text style={styles.contact}>{pd.email}</Text>}
            {pd.phone && <Text style={styles.contact}>{pd.phone}</Text>}
            {(pd.city || pd.country) && <Text style={styles.contact}>{pd.city}{pd.city && pd.country ? ', ' : ''}{pd.country}</Text>}
            {pd.linkedin && <Text style={styles.contact}>{pd.linkedin}</Text>}
          </View>
        </View>

        {introduction.professionalSummary && introduction.professionalSummary.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.text}>{stripHtml(introduction.professionalSummary)}</Text>
          </View>
        )}

        {experiences && experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 10 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.role}>{exp.position}</Text>
                  <Text style={styles.italic}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate ? formatEnd(exp.current, exp.endDate) : ''}</Text>
                </View>
                {exp.company && <Text style={styles.company}>{exp.company}{exp.location ? ' | ' + exp.location : ''}</Text>}
                {exp.achievements && exp.achievements.trim() && (
                  <>
                    {stripHtml(exp.achievements).split('\n').filter(Boolean).map((line, i) => (
                      <View key={i} style={{ flexDirection: 'row', marginLeft: 8, marginBottom: 2 }}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={{ flex: 1, fontSize: 9, color: '#333' }}>{line.trim()}</Text>
                      </View>
                    ))}
                  </>
                )}
                {exp.description && exp.description.trim() && (
                  <Text style={styles.text}>{stripHtml(exp.description)}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {educations && educations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {educations.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 8 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.role}>{getDegreeLabel(edu.degree)}{edu.fieldOfStudy ? ': ' + edu.fieldOfStudy : ''}</Text>
                  <Text style={styles.italic}>{edu.startDate} — {edu.current ? 'Present' : edu.endDate ? formatEnd(edu.current, edu.endDate) : ''}</Text>
                </View>
                {edu.institution && <Text style={styles.company}>{edu.institution}{edu.location ? ' | ' + edu.location : ''}</Text>}
                {edu.gpa && edu.gpa.trim() && <Text style={styles.textSmall}>{getResultLabel(edu.resultType, edu.gpa)}</Text>}
              </View>
            ))}
          </View>
        )}

        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.map((skill) => (
              <View key={skill.id} style={{ marginBottom: 6 }}>
                {skill.technicalSkills && skill.technicalSkills.trim() && (
                  <View style={styles.skillRow}>
                    {skill.technicalSkills.split(',').map((s, i) => (
                      <Text key={i} style={styles.skillTag}>{s.trim()}</Text>
                    ))}
                  </View>
                )}
                {skill.softSkills && skill.softSkills.trim() && (
                  <Text style={styles.textSmall}>Soft Skills: {skill.softSkills}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((pr) => (
              <View key={pr.id} style={{ marginBottom: 8 }}>
                <Text style={styles.role}>{pr.name}</Text>
                {pr.role && <Text style={styles.company}>{pr.role}</Text>}
                <Text style={styles.desc}>{stripHtml(pr.description)}</Text>
              </View>
            ))}
          </View>
        )}

        {credentials && credentials.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {credentials.map((cred) => (
              <View key={cred.id} style={{ marginBottom: 6 }}>
                <Text style={styles.role}>{cred.certificateName}</Text>
                {cred.issuer && <Text style={styles.company}>{cred.issuer}</Text>}
                {(cred.dateIssued || cred.expirationDate) && (
                  <Text style={styles.dateLocation}>
                    {cred.dateIssued && new Date(cred.dateIssued + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {cred.expirationDate && ' — ' + new Date(cred.expirationDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {medicalScience && medicalScience.length > 0 && (
          <View style={styles.section}>
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
      </Page>
    </Document>
  );
};

export default CVTemplateExecutive;
