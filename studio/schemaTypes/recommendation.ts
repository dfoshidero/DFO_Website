import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'

export const recommendation = defineType({
  name: 'recommendation',
  title: 'Recommendation',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'text',
      title: 'Recommendation',
      type: 'text',
      rows: 8,
      description: 'The quote itself. The site adds the closing quote mark.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'recommender',
      title: 'Recommender',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Their role',
      type: 'string',
      description: 'e.g. "Founder, Datern".',
      validation: (rule) => rule.required(),
    }),
    orderRankField({type: 'recommendation'}),
  ],
  preview: {
    select: {title: 'recommender', subtitle: 'role'},
  },
})
