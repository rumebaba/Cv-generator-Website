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
  mainText: '#1e293b',
  mainMuted: '#64748b',
};

const s = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: colors.mainText,
    lineHeight: 1.4,
  },
  sidebar: {
    width: 190,
    backgroundColor: colors.sidebarBg,
    color: colors.sidebarText,
    padding: 24,
  },
  photo: { width: 70, height: 70, borderRadius: 35, alignSelf: 'center', marginBottom: 12 },
  name: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: colors.sidebarText,
    textAlign: 'center' as const,
  },
  subtitle: { fontSize: 9, color: colors.sidebarMuted, marginTop: 4, textAlign: 'center' as const },
  sidebarSection: { marginBottom: 18 },
  sidebarTitle: {
    fontSize: 8,
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
  main: { flex: 1, padding: 28 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold' as const,
    color: colors.primary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingBottom: 3,
  },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  bold: { fontWeight: 'bold' as const },
  italic: { fontFamily: 'Helvetica-Oblique', fontSize: 9, color: colors.mainMuted },
  desc: { lineHeight: 1.5, marginBottom: 8, marginTop: 3 },
  text: { fontSize: 9, color: colors.mainText },
  textSmall: { fontSize: 8, color: colors.mainMuted },
  role: { fontSize: 10, fontWeight: 'bold' as const, color: colors.mainText },
  company: { fontSize: 9, color: colors.primary, marginBottom: 1 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap' as const, gap: 4 },
  bullet: { width: 10, fontSize: 9, color: colors.primary },
  bulletText: { flex: 1, fontSize: 9, color: colors.mainText },
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
    medicalScience,
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
                    <View style={s.skillsRow}>
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

          {educations.length > 0 && (
            <View style={s.sidebarSection}>
              <Text style={s.sidebarTitle}>Education</Text>
              {educations.map((edu) => (
                <Text key={edu.id} style={s.contactItem}>
                  {getDegreeLabel(edu.degree)}
                  {edu.fieldOfStudy ? ': ' + edu.fieldOfStudy : ''} — {edu.institution}
                </Text>
              ))}
            </View>
          )}
        </View>

        <View style={s.main}>
          {/* Summary */}
          {introduction.professionalSummary && introduction.professionalSummary.trim() && (
            <View style={{ marginBottom: 16 }}>
              <Text style={s.sectionTitle}>Professional Summary</Text>
              <Text style={s.text}>{stripHtml(introduction.professionalSummary)}</Text>
            </View>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={s.sectionTitle}>Experience</Text>
              {experiences.map((exp) => (
                <View key={exp.id} style={{ marginBottom: 10 }}>
                  <View style={s.entryHeader}>
                    <Text style={s.role}>{exp.position}</Text>
                    <Text style={s.italic}>
                      {exp.startDate} —{' '}
                      {exp.current
                        ? 'Present'
                        : exp.endDate
                          ? formatDateRange(exp.startDate, exp.endDate, exp.current)
                          : ''}
                    </Text>
                  </View>
                  {exp.company && (
                    <Text style={s.company}>
                      {exp.company}
                      {exp.location ? ' | ' + exp.location : ''}
                    </Text>
                  )}
                  {exp.achievements &&
                    htmlToBullets(exp.achievements).map((b, j) => (
                      <Text
                        key={j}
                        style={{
                          marginLeft: 10,
                          fontSize: 9,
                          color: colors.mainMuted,
                          marginBottom: 2,
                        }}
                      >
                        • {b}
                      </Text>
                    ))}
                  {exp.description && <Text style={s.desc}>{stripHtml(exp.description)}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {educations.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={s.sectionTitle}>Education</Text>
              {educations.map((edu) => (
                <View key={edu.id} style={{ marginBottom: 6 }}>
                  <View style={s.entryHeader}>
                    <Text style={s.bold}>
                      {getDegreeLabel(edu.degree)}
                      {edu.fieldOfStudy ? ': ' + edu.fieldOfStudy : ''}
                    </Text>
                    <Text style={s.italic}>
                      {edu.startDate} —{' '}
                      {edu.current
                        ? 'Present'
                        : edu.endDate
                          ? formatDateRange(edu.startDate, edu.endDate, edu.current)
                          : ''}
                    </Text>
                  </View>
                  {edu.institution && <Text style={s.company}>{edu.institution}</Text>}
                  {edu.gpa && (
                    <Text style={s.textSmall}>{getResultLabel(edu.resultType, edu.gpa)}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={s.sectionTitle}>Projects</Text>
              {projects.map((proj) => (
                <View key={proj.id} style={{ marginBottom: 6 }}>
                  <Text style={s.bold}>{proj.name}</Text>
                  {proj.role && <Text style={s.company}>{proj.role}</Text>}
                  <Text style={s.desc}>{stripHtml(proj.description)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Credentials */}
          {credentials.length > 0 && credentials.some((c) => c.certificateName) && (
            <View style={{ marginBottom: 16 }}>
              <Text style={s.sectionTitle}>Certifications</Text>
              {credentials.map((cred) => (
                <View key={cred.id} style={{ marginBottom: 4 }}>
                  <Text style={s.role}>{cred.certificateName}</Text>
                  {cred.issuer && <Text style={s.company}>{cred.issuer}</Text>}
                  {(cred.dateIssued || cred.expirationDate) && (
                    <Text style={s.textSmall}>
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

          {/* Languages */}
          {skills.length > 0 && skills.some((sk) => sk.spokenLanguages) && (
            <View style={{ marginBottom: 16 }}>
              <Text style={s.sectionTitle}>Languages</Text>
              <Text style={s.text}>
                {skills
                  .filter((sk) => sk.spokenLanguages)
                  .map((sk) => sk.spokenLanguages)
                  .join(', ')}
              </Text>
            </View>
          )}

          {/* Medical & Science */}
          {medicalScience.length > 0 && (
            <View>
              <Text style={s.sectionTitle}>Medical & Science</Text>
              {medicalScience.map((ms) => (
                <View key={ms.id} style={{ marginBottom: 5 }}>
                  {ms.clinicalRotations && ms.clinicalRotations.trim() && (
                    <Text style={s.text}>Clinical Rotations: {ms.clinicalRotations}</Text>
                  )}
                  {ms.researchGrants && ms.researchGrants.trim() && (
                    <Text style={s.text}>Research Grants: {ms.researchGrants}</Text>
                  )}
                  {ms.publications && ms.publications.trim() && (
                    <Text style={s.text}>Publications: {ms.publications}</Text>
                  )}
                  {ms.medicalLicenses && ms.medicalLicenses.trim() && (
                    <Text style={s.text}>Licenses: {ms.medicalLicenses}</Text>
                  )}
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
