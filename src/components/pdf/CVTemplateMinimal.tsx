import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import React from 'react';

import type { FormState } from '../../types/form';
import { stripHtml } from '../../utils/stripHtml';
import { getDegreeLabel, getResultLabel } from '../../utils/cvHelpers';

const styles = StyleSheet.create({
  page: { padding: 44, fontFamily: 'Helvetica', fontSize: 10, color: '#222' },
  name: { fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 6 },
  contact: { fontSize: 9, color: '#666', marginBottom: 16, lineHeight: 1.4 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#888', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  bold: { fontFamily: 'Helvetica-Bold' },
  light: { fontSize: 9, color: '#888' },
  desc: { lineHeight: 1.5, marginBottom: 6, marginTop: 2 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  skillTag: { backgroundColor: '#f5f5f5', borderRadius: 3, paddingHorizontal: 6, paddingVertical: 1.5, fontSize: 8, color: '#666', marginBottom: 2 },
});

const CVTemplateMinimal: React.FC<{ formState: FormState }> = ({ formState }) => {
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
        {pd.profilePhotoUrl && <Image style={{ width: 50, height: 50, borderRadius: 25, alignSelf: 'center', marginBottom: 8 }} src={pd.profilePhotoUrl} />}
        <Text style={styles.name}>{pd.fullName || 'Your Name'}</Text>
        <Text style={styles.contact}>
          {[pd.email, pd.phone, pd.city || pd.country, pd.linkedin].filter(Boolean).join('  ·  ')}
        </Text>

        {introduction.professionalSummary && introduction.professionalSummary.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={{ ...styles.desc, marginBottom: 14 }}>{stripHtml(introduction.professionalSummary)}</Text>
          </View>
        )}

        {experiences && experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 6 }}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{exp.position}, {exp.company}</Text>
                  <Text style={styles.light}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate ? formatEnd(exp.current, exp.endDate) : ''}</Text>
                </View>
                <Text style={styles.desc}>{stripHtml(exp.description)}</Text>
              </View>
            ))}
          </View>
        )}

        {educations && educations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {educations.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 4 }}>
                <View style={styles.row}>
                  <Text>{getDegreeLabel(edu.degree)} {edu.fieldOfStudy}, <Text style={styles.bold}>{edu.institution}</Text></Text>
                  <Text style={styles.light}>{edu.startDate} — {edu.current ? 'Present' : edu.endDate ? formatEnd(edu.current, edu.endDate) : ''}{edu.gpa ? ` · ${getResultLabel(edu.resultType, edu.gpa)}` : ''}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsRow}>
              {skills.map((skill) => (
                <React.Fragment key={skill.id}>
                  {skill.technicalSkills && skill.technicalSkills.trim() && (
                    skill.technicalSkills.split(',').map((s, i) => (
                      <Text key={i} style={styles.skillTag}>{s.trim()}</Text>
                    ))
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        )}

        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((pr) => (
              <View key={pr.id} style={{ marginBottom: 4 }}>
                <Text><Text style={styles.bold}>{pr.name}</Text> — {pr.role}</Text>
                <Text style={styles.desc}>{stripHtml(pr.description)}</Text>
              </View>
            ))}
          </View>
        )}

        {credentials && credentials.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {credentials.map((cred) => (
              <View key={cred.id} style={{ marginBottom: 4 }}>
                <Text style={styles.bold}>{cred.certificateName}</Text>
                {cred.issuer && <Text style={styles.light}>{cred.issuer}</Text>}
                {(cred.dateIssued || cred.expirationDate) && (
                  <Text style={styles.light}>
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
              <View key={ms.id} style={{ marginBottom: 4 }}>
                {ms.clinicalRotations && ms.clinicalRotations.trim() && <Text style={styles.desc}>Clinical Rotations: {ms.clinicalRotations}</Text>}
                {ms.researchGrants && ms.researchGrants.trim() && <Text style={styles.desc}>Research Grants: {ms.researchGrants}</Text>}
                {ms.publications && ms.publications.trim() && <Text style={styles.desc}>Publications: {ms.publications}</Text>}
                {ms.medicalLicenses && ms.medicalLicenses.trim() && <Text style={styles.desc}>Licenses: {ms.medicalLicenses}</Text>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CVTemplateMinimal;
