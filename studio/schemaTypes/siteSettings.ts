import {defineField, defineType} from 'sanity'

const SEVERITIES = [
  {title: 'Available (green)', value: 'available'},
  {title: 'Busy (amber)', value: 'busy'},
]

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'links', title: 'Links'},
    {name: 'files', title: 'CV'},
    {name: 'status', title: 'Status'},
    {name: 'misc', title: 'Location & footer'},
  ],
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full name',
      type: 'string',
      description: 'Shown in the header next to the profile picture.',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'The line under the name, e.g. "Designer & Programmer // DFVRO".',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'profileIcon',
      title: 'Profile picture',
      type: 'image',
      options: {hotspot: true},
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      description: 'Used by the header Contact button and the portfolio "Report Issue" link.',
      group: 'identity',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn profile',
      type: 'url',
      group: 'links',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub profile',
      type: 'url',
      group: 'links',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'recommendationsMoreUrl',
      title: 'Recommendations "READ MORE" link',
      type: 'url',
      group: 'links',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'projectsMoreUrl',
      title: 'Projects "VIEW REPOSITORIES" link',
      type: 'url',
      group: 'links',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cvFile',
      title: 'CV',
      type: 'file',
      description: 'Upload a new PDF to replace the downloadable CV. No deploy needed.',
      group: 'files',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cvDownloadName',
      title: 'CV download filename',
      type: 'string',
      description:
        'The filename the visitor gets, including ".pdf". Sent as the ?dl= parameter on the download link.',
      group: 'files',
      validation: (rule) =>
        rule.required().custom((value) =>
          typeof value === 'string' && value.toLowerCase().endsWith('.pdf')
            ? true
            : 'Must end in .pdf'
        ),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'object',
      group: 'status',
      options: {collapsible: false},
      fields: [
        defineField({
          name: 'indicatorSeverity',
          title: 'Indicator colour',
          type: 'string',
          description: 'The dot next to the STATUS card title.',
          options: {list: SEVERITIES, layout: 'radio'},
          initialValue: 'available',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'lines',
          title: 'Status lines',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'statusLine',
              fields: [
                defineField({
                  name: 'message',
                  title: 'Message',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'severity',
                  title: 'Severity',
                  type: 'string',
                  options: {list: SEVERITIES, layout: 'radio'},
                  initialValue: 'available',
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: {
                select: {title: 'message', subtitle: 'severity'},
              },
            },
          ],
          validation: (rule) => rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'timezoneLabel',
      title: 'Location label',
      type: 'string',
      description: 'Shown in the corner of the TIMEZONE card, e.g. "London, UK".',
      group: 'misc',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'timezoneIana',
      title: 'Time zone',
      type: 'string',
      description: 'IANA name driving the clock, e.g. "Europe/London".',
      group: 'misc',
      initialValue: 'Europe/London',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (typeof value !== 'string') return 'Required'
          try {
            new Intl.DateTimeFormat('en-GB', {timeZone: value})
            return true
          } catch {
            return `"${value}" is not a valid IANA time zone`
          }
        }),
    }),
    defineField({
      name: 'copyrightName',
      title: 'Copyright name',
      type: 'string',
      description: 'Footer: "© <year> <name>. All rights reserved."',
      group: 'misc',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'fullName', subtitle: 'tagline', media: 'profileIcon'},
  },
})
