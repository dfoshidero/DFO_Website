import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Job title only. The company goes in its own field.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      description: 'Optional. Shown under the role on the card.',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description: 'The summary shown on the card, before the modal is opened.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'longDescription',
      title: 'Full description',
      type: 'array',
      description: 'Shown in the modal. Paragraphs, bullet lists and links.',
      of: [
        defineArrayMember({
          type: 'block',
          // Matches what the old HTML used, and what .experience-body styles.
          styles: [{title: 'Paragraph', value: 'normal'}],
          lists: [{title: 'Bullet', value: 'bullet'}],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (rule) => rule.required(),
                  }),
                ],
              },
            ],
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'One per entry. Joined with " · " on the site.',
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'logo',
      title: 'Company logo',
      type: 'image',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'legacyId',
      title: 'Legacy id',
      type: 'number',
      readOnly: true,
      hidden: true,
    }),
    orderRankField({type: 'experience'}),
  ],
  preview: {
    select: {title: 'role', subtitle: 'company', media: 'logo'},
  },
})
