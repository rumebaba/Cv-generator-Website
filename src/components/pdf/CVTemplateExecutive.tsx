import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import React from 'react';

import type { FormState } from '../../types/form';
import { getDegreeLabel, getResultLabel, htmlToBullets } from '../../utils/cvHelpers';
import { formatDateRange } from '../../utils/formatDate';
import { stripHtml } from '../../utils/stripHtml';

const colors = { primary: '#1a1a2e', gold: '#c9a84c', gray: '#666', light: '#f5f5f0' };

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#1a1a2e', lineHeight: 1.5 },
  header: {
    backgroundColor: colors.primary,
    padding: 28,
    marginBottom: 20,
    textAlign: 'center' as const,
  },
  photo: { width: 65, height: 65, borderRadius: 33, alignSelf: 'center', marginBottom: 10 },
  name: {
    fontSize: 22,
    fontWeight: 'bold' as const,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    color: colors.gold,
  },
  subtitle: { fontSize: 10, color: '#b0b0b0', marginTop: 4, letterSpacing: 1 },
  contact: { fontSize: 8, color: '#999', marginTop: 8, textAlign: 'center' as const },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    color: colors.primary,
    textTransform: 'uppercase' as const,
    borderBottomWidth: 1,
    borderBottomColor: colors.gold,
    paddingBottom: 4,
    marginBottom: 8,
    marginTop: 14,
    letterSpacing: 1,
  },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  bold: { fontWeight: 'bold' as const },
  italic: { fontFamily: 'Helvetica-Oblique', fontSize: 9, color: colors.gray },
  text: { fontSize: 9, color: '#333', marginBottom: 4 },
  textSmall: { fontSize: 8, color: colors.gray },
  role: { fontSize: 10, fontWeight: 'bold' as const, color: colors.primary, marginBottom: 2 },
  company: { fontSize: 9, color: '#4f46e5', marginBottom: 1 },
  dateLocation: { fontSize: 8, color: '#666', marginBottom: 3 },
  skillTag: {
    backgroundColor: '#f0e6d2',
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 8,
    color: colors.primary,
    marginBottom: 2,
  },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap' as const, gap: 4 },
  bullet: { width: 8, fontSize: 9, color: colors.gold },
  bulletText: { flex: 1, fontSize: 9, color: '#333' },
});

const CVTemplateExecutive: React.FC<{ formState: FormState }> = ({ formState }) => {
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
        {pd.profilePhotoUrl && <Image style={styles.photo} src={pd.profilePhotoUrl} />}
        <View style={styles.header}>
          <Text style={styles.name}>{pd.fullName || 'Your Name'}</Text>
          {introduction.targetJobTitles && introduction.targetJobTitles.trim() && (
            <Text style={styles.subtitle}>{introduction.targetJobTitles}</Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 8,
            }}
          >
            {pd.email && <Text style={styles.contact}>{pd.email}</Text>}
            {pd.phone && <Text style={styles.contact}>{pd.phone}</Text>}
            {(pd.city || pd.country) && (
              <Text style={styles.contact}>
                {pd.city}
                {pd.city && pd.country ? ', ' : ''}
                {pd.country}
              </Text>
            )}
            {pd.linkedin && <Text style={styles.contact}>{pd.linkedin}</Text>}
          </View>
        </View>

        {shouldShow('introduction') && introduction.professionalSummary && introduction.professionalSummary.trim() && (
          <View style={{ marginBottom: 14 }}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={{ fontSize: 9, color: '#333', lineHeight: 1.5 }}>
              {stripHtml(introduction.professionalSummary)}
            </Text>
          </View>
        )}

        {shouldShow('experiences') && experiences.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 12 }}>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}
                >
                  <Text style={styles.role}>{exp.position}</Text>
                  <Text style={styles.italic}>
                    {exp.startDate} —{' '}
                    {exp.current
                      ? 'Present'
                      : exp.endDate
                        ? formatDateRange(exp.startDate, exp.endDate, exp.current)
                        : ''}
                  </Text>
                </View>
                {exp.company && (
                  <Text style={styles.company}>
                    {exp.company}
                    {exp.location ? ' | ' + exp.location : ''}
                  </Text>
                )}
                {exp.achievements &&
                  htmlToBullets(exp.achievements).map((b, j) => (
                    <View key={j} style={{ flexDirection: 'row', marginLeft: 10, marginBottom: 3 }}>
                      <Text style={{ fontSize: 9, color: colors.gold }}>•</Text>
                      <Text style={{ flex: 1, fontSize: 9, color: '#333' }}>{b}</Text>
                    </View>
                  ))}
                {exp.description && (
                  <Text style={{ fontSize: 9, color: '#333', lineHeight: 1.5, marginTop: 4 }}>
                    {stripHtml(exp.description)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {shouldShow('educations') && educations.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Education</Text>
            {educations.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 8 }}>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}
                >
                  <Text style={styles.role}>
                    {getDegreeLabel(edu.degree)}
                    {edu.fieldOfStudy ? ': ' + edu.fieldOfStudy : ''}
                  </Text>
                  <Text style={styles.italic}>
                    {edu.startDate} —{' '}
                    {edu.current
                      ? 'Present'
                      : edu.endDate
                        ? formatDateRange(edu.startDate, edu.endDate, edu.current)
                        : ''}
                  </Text>
                </View>
                {edu.institution && (
                  <Text style={{ fontSize: 9, color: '#4f46e5', marginBottom: 1 }}>
                    {edu.institution}
                    {edu.location ? ' | ' + edu.location : ''}
                  </Text>
                )}
                {edu.gpa && edu.gpa.trim() && (
                  <Text style={{ fontSize: 8, color: '#666' }}>
                    {getResultLabel(edu.resultType, edu.gpa)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {shouldShow('skills') && skills.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.map((skill) => (
              <View key={skill.id} style={{ marginBottom: 8 }}>
                {skill.technicalSkills && skill.technicalSkills.trim() && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                    {skill.technicalSkills.split(',').map((s, i) => (
                      <Text key={i} style={styles.skillTag}>
                        {s.trim()}
                      </Text>
                    ))}
                  </View>
                )}
                {skill.softSkills && skill.softSkills.trim() && (
                  <Text style={{ fontSize: 8, color: '#666', marginTop: 4 }}>
                    Soft Skills: {skill.softSkills}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {shouldShow('projects') && projects.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((pr) => (
              <View key={pr.id} style={{ marginBottom: 8 }}>
                <Text style={styles.role}>{pr.name}</Text>
                {pr.role && <Text style={styles.company}>{pr.role}</Text>}
                <Text style={{ fontSize: 9, color: '#333', lineHeight: 1.5, marginTop: 2 }}>
                  {stripHtml(pr.description)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {shouldShow('credentials') && credentials.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {credentials.map((cred) => (
              <View key={cred.id} style={{ marginBottom: 6 }}>
                <Text style={styles.role}>{cred.certificateName}</Text>
                {cred.issuer && <Text style={styles.company}>{cred.issuer}</Text>}
                {(cred.dateIssued || cred.expirationDate) && (
                  <Text style={{ fontSize: 8, color: '#666' }}>
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
          <View>
            <Text style={styles.sectionTitle}>Medical & Science</Text>
            {medicalScience.map((ms) => (
              <View key={ms.id} style={{ marginBottom: 6 }}>
                {ms.clinicalRotations && ms.clinicalRotations.trim() && (
                  <Text style={{ fontSize: 9, color: '#333' }}>
                    Clinical Rotations: {ms.clinicalRotations}
                  </Text>
                )}
                {ms.researchGrants && ms.researchGrants.trim() && (
                  <Text style={{ fontSize: 9, color: '#333' }}>
                    Research Grants: {ms.researchGrants}
                  </Text>
                )}
                {ms.publications && ms.publications.trim() && (
                  <Text style={{ fontSize: 9, color: '#333' }}>
                    Publications: {ms.publications}
                  </Text>
                )}
                {ms.medicalLicenses && ms.medicalLicenses.trim() && (
                  <Text style={{ fontSize: 9, color: '#333' }}>Licenses: {ms.medicalLicenses}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CVTemplateExecutive;
