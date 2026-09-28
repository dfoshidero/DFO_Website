import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'

export const education = defineType({
  name: 'education',
  title: 'Education & certification',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Master of Science (M.Sc) // Computer Science".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      description: 'Drives how the row is styled. Certifications get the "View" button.',
      options: {
        list: [
          {title: 'Degree', value: 'degree'},
          {title: 'A-levels', value: 'a-levels'},
          {title: 'Certification', value: 'certification'},
        ],
        layout: 'radio',
      },
      initialValue: 'certification',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'school',
      title: 'School / issuer',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Shown on its own line, under the school, when both are set.',
    }),
    defineField({
      name: 'graduation',
      title: 'Date line',
      type: 'string',
      description: 'e.g. "Graduated 2023" or "Issued Sept 2024".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'achieved',
      title: 'Grade achieved',
      type: 'string',
      description: 'Optional, e.g. "2:1" or "A*, A, A". Appended after the date line.',
    }),
    defineField({
      name: 'link',
      title: 'Certificate link',
      type: 'url',
      description: 'Optional. Adds the "View" button.',
    }),
    defineField({
      name: 'legacyId',
      title: 'Legacy id',
      type: 'number',
      readOnly: true,
      hidden: true,
    }),
    orderRankField({type: 'education'}),
  ],
  preview: {
    select: {title: 'title', school: 'school', graduation: 'graduation'},
    prepare({title, school, graduation}) {
      return {
        title,
        subtitle: [school, graduation].filter(Boolean).join(' — '),
      }
    },
  },
})
