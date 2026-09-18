import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import React from 'react';

import type { FormState } from '../../types/form';
import { getDegreeLabel, getResultLabel, htmlToBullets } from '../../utils/cvHelpers';
import { formatDateRange } from '../../utils/formatDate';
import { stripHtml } from '../../utils/stripHtml';

const styles = StyleSheet.create({
  page: { padding: 44, fontFamily: 'Helvetica', fontSize: 10, color: '#1e293b', lineHeight: 1.5 },
  header: { marginBottom: 18, textAlign: 'center' },
  photo: { width: 60, height: 60, borderRadius: 30, alignSelf: 'center', marginBottom: 8 },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 4,
    color: '#1e3a5f',
  },
  subtitle: {
    fontSize: 11,
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 9,
    color: '#64748b',
    marginBottom: 12,
  },
  hr: { borderBottomWidth: 1, borderBottomColor: '#1e3a5f', marginVertical: 10 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1e3a5f',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e3a5f',
    paddingBottom: 4,
  },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  bold: { fontFamily: 'Helvetica-Bold' },
  italic: { fontFamily: 'Helvetica-Oblique', fontSize: 9, color: '#64748b' },
  desc: { lineHeight: 1.6, marginBottom: 8, marginTop: 3 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  skillTag: {
    backgroundColor: '#eef2ff',
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 8,
    color: '#1e3a5f',
    marginBottom: 3,
  },
  bulletRow: { flexDirection: 'row', marginLeft: 10, marginBottom: 3 },
  bullet: { width: 10, fontSize: 9, color: '#1e3a5f' },
  bulletText: { flex: 1, fontSize: 9, color: '#334155' },
});

const CVTemplateClassic: React.FC<{ formState: FormState }> = ({ formState }) => {
  const { data } = formState;
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
          <View style={styles.contactRow}>
            {pd.email && <Text>{pd.email}</Text>}
            {pd.phone && <Text>{pd.phone}</Text>}
            {(pd.city || pd.country) && (
              <Text>
                {pd.city}
                {pd.city && pd.country ? ', ' : ''}
                {pd.country}
              </Text>
            )}
            {pd.linkedin && <Text>{pd.linkedin}</Text>}
          </View>
        </View>

        {introduction.professionalSummary && introduction.professionalSummary.trim() && (
          <>
            <View style={styles.hr} />
            <Text style={styles.desc}>{stripHtml(introduction.professionalSummary)}</Text>
          </>
        )}

        {experiences && experiences.length > 0 && (
          <>
            <View style={styles.hr} />
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 10 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.bold}>{exp.company}</Text>
                  <Text style={styles.italic}>
                    {exp.startDate} —{' '}
                    {exp.current
                      ? 'Present'
                      : exp.endDate
                        ? formatEnd(exp.current, exp.endDate)
                        : ''}
                  </Text>
                </View>
                <Text style={styles.italic}>{exp.position}</Text>
                {exp.location && <Text style={styles.italic}>{exp.location}</Text>}
                <Text style={styles.desc}>{stripHtml(exp.description)}</Text>
                {exp.achievements &&
                  htmlToBullets(exp.achievements).map((b, j) => (
                    <View key={j} style={styles.bulletRow}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bulletText}>{b}</Text>
                    </View>
                  ))}
              </View>
            ))}
          </>
        )}

        {educations && educations.length > 0 && (
          <>
            <View style={styles.hr} />
            <Text style={styles.sectionTitle}>Education</Text>
            {educations.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 6 }}>
                <View style={styles.entryHeader}>
                  <Text>
                    <Text style={styles.bold}>
                      {getDegreeLabel(edu.degree)}
                      {edu.fieldOfStudy ? ': ' + edu.fieldOfStudy : ''}
                    </Text>
                  </Text>
                  <Text style={styles.italic}>
                    {edu.startDate} —{' '}
                    {edu.current
                      ? 'Present'
                      : edu.endDate
                        ? formatEnd(edu.current, edu.endDate)
                        : ''}
                  </Text>
                </View>
                {edu.institution && <Text style={styles.italic}>{edu.institution}</Text>}
                {edu.gpa && edu.gpa.trim() && (
                  <Text style={styles.italic}>{getResultLabel(edu.resultType, edu.gpa)}</Text>
                )}
              </View>
            ))}
          </>
        )}

        {skills && skills.length > 0 && (
          <>
            <View style={styles.hr} />
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.map((skill) => (
              <View key={skill.id} style={{ marginBottom: 5 }}>
                {skill.technicalSkills && skill.technicalSkills.trim() && (
                  <View style={styles.skillsRow}>
                    {skill.technicalSkills.split(',').map((s, i) => (
                      <Text key={i} style={styles.skillTag}>
                        {s.trim()}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        {projects && projects.length > 0 && (
          <>
            <View style={styles.hr} />
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((pr) => (
              <View key={pr.id} style={{ marginBottom: 8 }}>
                <Text style={styles.bold}>{pr.name}</Text>
                <Text style={styles.desc}>{stripHtml(pr.description)}</Text>
              </View>
            ))}
          </>
        )}

        {credentials && credentials.length > 0 && (
          <>
            <View style={styles.hr} />
            <Text style={styles.sectionTitle}>Certifications</Text>
            {credentials.map((cred) => (
              <View key={cred.id} style={{ marginBottom: 5 }}>
                <Text style={styles.bold}>{cred.certificateName}</Text>
                {cred.issuer && <Text style={styles.italic}>{cred.issuer}</Text>}
                {(cred.dateIssued || cred.expirationDate) && (
                  <Text style={styles.italic}>
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
          </>
        )}

        {medicalScience && medicalScience.length > 0 && (
          <>
            <View style={styles.hr} />
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
          </>
        )}
      </Page>
    </Document>
  );
};

export default CVTemplateClassic;
