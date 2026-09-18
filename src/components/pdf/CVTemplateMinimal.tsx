import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import React from 'react';

import type { FormState } from '../../types/form';
import { getDegreeLabel, getResultLabel, htmlToBullets } from '../../utils/cvHelpers';
import { formatDateRange } from '../../utils/formatDate';
import { stripHtml } from '../../utils/stripHtml';

const green = { primary: '#059669', light: '#d1fae5', dark: '#064e3b', gray: '#6b7280' };

const styles = StyleSheet.create({
  page: { padding: 44, fontFamily: 'Helvetica', fontSize: 10, color: '#1f2937', lineHeight: 1.5 },
  header: {
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: green.primary,
  },
  photo: { width: 50, height: 50, borderRadius: 25, alignSelf: 'flex-start', marginBottom: 12 },
  name: { fontSize: 22, fontWeight: 'bold', color: green.dark, marginBottom: 6 },
  contact: { fontSize: 9, color: green.gray, marginBottom: 18, lineHeight: 1.4 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: green.gray,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
    marginTop: 16,
  },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  bold: { fontWeight: 'bold' },
  light: { fontSize: 9, color: green.gray },
  desc: { lineHeight: 1.6, marginBottom: 8, marginTop: 3 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  skillTag: {
    backgroundColor: green.light,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 8,
    color: green.dark,
    marginBottom: 2,
  },
});

const CVTemplateMinimal: React.FC<{ formState: FormState }> = ({ formState }) => {
  const { data, selectedSections } = formState;
  const {
    personalData: pd,
    introduction,
    educations,
    experiences,
    projects,
    skills,
    credentials,
    medicalScience,
  } = data;

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
        {pd.profilePhotoUrl && (
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              alignSelf: 'flex-start',
              marginBottom: 12,
            }}
            src={pd.profilePhotoUrl}
          />
        )}
        <Text style={styles.name}>{pd.fullName || 'Your Name'}</Text>
        <Text style={styles.contact}>
          {[pd.email, pd.phone, pd.city || pd.country, pd.linkedin].filter(Boolean).join('  ·  ')}
        </Text>

        {shouldShow('introduction') && introduction.professionalSummary && introduction.professionalSummary.trim() && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={{ ...styles.desc, marginBottom: 14 }}>
              {stripHtml(introduction.professionalSummary)}
            </Text>
          </View>
        )}

        {shouldShow('experiences') && experiences.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 10 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.bold}>
                    {exp.position}, {exp.company}
                  </Text>
                  <Text style={styles.light}>
                    {exp.startDate} —{' '}
                    {exp.current
                      ? 'Present'
                      : exp.endDate
                        ? formatDateRange(exp.startDate, exp.endDate, exp.current)
                        : ''}
                    {exp.location && ` | ${exp.location}`}
                  </Text>
                </View>
                <Text style={styles.desc}>{stripHtml(exp.description)}</Text>
                {exp.achievements &&
                  htmlToBullets(exp.achievements).map((b, j) => (
                    <View key={j} style={{ flexDirection: 'row', marginLeft: 10, marginBottom: 3 }}>
                      <Text style={{ fontSize: 9, color: green.primary }}>•</Text>
                      <Text style={{ flex: 1, fontSize: 9, color: '#374151' }}>{b}</Text>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        )}

        {shouldShow('educations') && educations.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Education</Text>
            {educations.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 6 }}>
                <View style={styles.entryHeader}>
                  <Text>
                    {getDegreeLabel(edu.degree)} {edu.fieldOfStudy},{' '}
                    <Text style={styles.bold}>{edu.institution}</Text>
                  </Text>
                  <Text style={styles.light}>
                    {edu.startDate} —{' '}
                    {edu.current
                      ? 'Present'
                      : edu.endDate
                        ? formatDateRange(edu.startDate, edu.endDate, edu.current)
                        : ''}
                    {edu.gpa ? ` · ${getResultLabel(edu.resultType, edu.gpa)}` : ''}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {shouldShow('skills') && skills.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsRow}>
              {skills.map((skill) => (
                <React.Fragment key={skill.id}>
                  {skill.technicalSkills &&
                    skill.technicalSkills.trim() &&
                    skill.technicalSkills.split(',').map((s, i) => (
                      <Text key={i} style={styles.skillTag}>
                        {s.trim()}
                      </Text>
                    ))}
                </React.Fragment>
              ))}
            </View>
          </View>
        )}

        {shouldShow('projects') && projects.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((pr) => (
              <View key={pr.id} style={{ marginBottom: 6 }}>
                <Text>
                  <Text style={styles.bold}>{pr.name}</Text> — {pr.role}
                </Text>
                <Text style={styles.desc}>{stripHtml(pr.description)}</Text>
              </View>
            ))}
          </View>
        )}

        {shouldShow('credentials') && credentials.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {credentials.map((cred) => (
              <View key={cred.id} style={{ marginBottom: 5 }}>
                <Text style={styles.bold}>{cred.certificateName}</Text>
                {cred.issuer && <Text style={styles.light}>{cred.issuer}</Text>}
                {(cred.dateIssued || cred.expirationDate) && (
                  <Text style={styles.light}>
                    {cred.dateIssued &&
                      new Date(cred.dateIssued + '-01').toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    {cred.expirationDate &&
                      ' — ' +
                        new Date(cred.expirationDate + '-01').toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {shouldShow('medicalScience') && medicalScience.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Medical & Science</Text>
            {medicalScience.map((ms) => (
              <View key={ms.id} style={{ marginBottom: 5 }}>
                {ms.clinicalRotations && ms.clinicalRotations.trim() && (
                  <Text style={styles.desc}>Clinical Rotations: {ms.clinicalRotations}</Text>
                )}
                {ms.researchGrants && ms.researchGrants.trim() && (
                  <Text style={styles.desc}>Research Grants: {ms.researchGrants}</Text>
                )}
                {ms.publications && ms.publications.trim() && (
                  <Text style={styles.desc}>Publications: {ms.publications}</Text>
                )}
                {ms.medicalLicenses && ms.medicalLicenses.trim() && (
                  <Text style={styles.desc}>Licenses: {ms.medicalLicenses}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CVTemplateMinimal;
