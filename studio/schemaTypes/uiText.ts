import {defineField, defineType} from 'sanity'

/**
 * Interface copy: the button labels, hints and messages that are not resume
 * content but are still words on the screen. Seeded from
 * scripts/migration/seed/uiText.json.
 *
 * Deliberately excluded: class names, form field names, ARIA roles and the card
 * size rules. Those are structural.
 */

const text = (name: string, title: string, description?: string) =>
  defineField({name, title, description, type: 'string', validation: (rule) => rule.required()})

export const uiText = defineType({
  name: 'uiText',
  title: 'Interface text',
  type: 'document',
  groups: [
    {name: 'chrome', title: 'Header & footer', default: true},
    {name: 'cards', title: 'Cards'},
    {name: 'portfolio', title: 'Portfolio'},
    {name: 'inquiry', title: 'Painting inquiry'},
    {name: 'meta', title: 'Page metadata'},
  ],
  fields: [
    defineField({
      name: 'cardTitles',
      title: 'Card titles',
      type: 'array',
      group: 'cards',
      description:
        'The heading on each card. The key identifies the card to the layout engine and must not change — edit the label only.',
      of: [
        {
          type: 'object',
          name: 'cardTitle',
          fields: [
            defineField({
              name: 'key',
              title: 'Card key',
              type: 'string',
              readOnly: true,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Displayed title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'key'}},
        },
      ],
    }),
    defineField({
      name: 'header',
      title: 'Header',
      type: 'object',
      group: 'chrome',
      fields: [
        text('profileIconAlt', 'Profile picture alt text'),
        text('shuffleButtonLabel', 'Shuffle button'),
        text('contactButtonLabel', 'Contact button'),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      group: 'chrome',
      fields: [
        text('rightsText', 'Rights text', 'Follows "© <year> <name>."'),
        text('builtWithText', 'Built-with line'),
        text('lastUpdatedPrefix', 'Last-updated prefix', 'Followed by the build date.'),
      ],
    }),
    defineField({
      name: 'cardExtras',
      title: 'Card buttons',
      type: 'object',
      group: 'cards',
      fields: [
        text('recommendationsMoreLabel', 'Recommendations "read more" button'),
        text('projectsMoreLabel', 'Projects "view repositories" button'),
        text('inquireButtonLabel', 'Painting inquiry button'),
        text('recommendationsRefreshAriaLabel', 'Refresh button screen-reader label'),
      ],
    }),
    defineField({
      name: 'projects',
      title: 'Projects card',
      type: 'object',
      group: 'cards',
      fields: [
        text('hint', 'Hint above the list'),
        text('stackPrefix', 'Stack prefix', 'Include the trailing space.'),
        text('demoButtonLabel', 'Demo button'),
      ],
    }),
    defineField({
      name: 'experience',
      title: 'Experience card',
      type: 'object',
      group: 'cards',
      fields: [
        text('skillsSectionLabel', 'Skills section label'),
        text(
          'skillsSeparator',
          'Skills separator',
          'Joins the skills list in the modal. Include the surrounding spaces.'
        ),
      ],
    }),
    defineField({
      name: 'education',
      title: 'Education card',
      type: 'object',
      group: 'cards',
      fields: [text('viewButtonLabel', 'Certificate button')],
    }),
    defineField({
      name: 'skills',
      title: 'Skills card',
      type: 'object',
      group: 'cards',
      fields: [
        text('certifiedLabel', 'Certified badge'),
        text('completedLabel', 'Course badge'),
        text('filterCertifiedLabel', 'Certified filter label'),
        text('filterCompletedLabel', 'Course filter label'),
        text('filterGroupLabel', 'Filter group screen-reader label'),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Connect card',
      type: 'object',
      group: 'cards',
      fields: [
        text('linkedinLabel', 'LinkedIn button'),
        text('githubLabel', 'GitHub button'),
        text('cvButtonLabel', 'CV download button'),
      ],
    }),
    defineField({
      name: 'portfolio',
      title: 'Portfolio card',
      type: 'object',
      group: 'portfolio',
      fields: [
        text('pullText', 'Attribution line'),
        text('loadingText', 'Loading message'),
        text('errorHelpText', 'Error help text'),
        text('reportButtonLabel', 'Report issue button'),
        text('reportEmailSubject', 'Report email subject'),
        defineField({
          name: 'reportEmailBody',
          title: 'Report email body',
          type: 'text',
          rows: 8,
          description: 'Plain text with real line breaks. The site URL-encodes it.',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'inquiryForm',
      title: 'Painting inquiry form',
      type: 'object',
      group: 'inquiry',
      description:
        'The form still posts to Netlify Forms, which does not deliver on Render. Editing this copy changes what visitors see; it does not make submissions arrive.',
      fields: [
        text('modalTitle', 'Modal title'),
        text('nameLabel', 'Name field'),
        text('emailLabel', 'Email field'),
        text('phoneLabel', 'Phone field'),
        text('paintingLabel', 'Painting field'),
        text('budgetLabel', 'Budget field'),
        text('budgetPlaceholder', 'Budget placeholder'),
        text('messageLabel', 'Message field'),
        text('requiredSuffix', 'Required suffix', 'Screen-reader only. Include the leading space.'),
        text('optionalSuffix', 'Optional suffix'),
        text('generalInquiryOption', 'No-painting option'),
        text('paintingsLoadingText', 'Paintings loading message'),
        text('paintingsErrorText', 'Paintings error message'),
        text('submitLabel', 'Submit button'),
        text('submittingLabel', 'Submit button, while sending'),
        text('successTitle', 'Success heading'),
        text('successText', 'Success message'),
        text('successButtonLabel', 'Send-another button'),
        text('submitFailedText', 'Submit failed message'),
        text('genericErrorText', 'Generic error message'),
        text('honeypotLabel', 'Honeypot label', 'Hidden from sighted users; catches bots.'),
      ],
    }),
    defineField({
      name: 'meta',
      title: 'Page metadata',
      type: 'object',
      group: 'meta',
      description:
        'Read at build time only. index.html is a static file served before React starts, so changing these needs a redeploy to take effect.',
      fields: [
        text('pageTitle', 'Browser tab title'),
        defineField({
          name: 'metaDescription',
          title: 'Meta description',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required().max(160),
        }),
        defineField({
          name: 'siteUrl',
          title: 'Canonical site URL',
          type: 'url',
          validation: (rule) => rule.required(),
        }),
        text('noscript', 'No-JavaScript message'),
        text('manifestName', 'Web app name'),
        text('manifestShortName', 'Web app short name'),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Interface text'}),
  },
})
