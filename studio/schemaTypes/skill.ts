import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'

export const skill = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'name',
      title: 'Skill',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'certified',
      title: 'Certified',
      type: 'boolean',
      description: 'Shows the "CERTIFIED" badge and matches the certified filter.',
      initialValue: false,
    }),
    defineField({
      name: 'completed',
      title: 'Course completed',
      type: 'boolean',
      description: 'Shows the "COURSE" badge and matches the completed filter.',
      initialValue: false,
    }),
    defineField({
      name: 'link',
      title: 'Proof link',
      type: 'url',
      description: 'Optional. Makes the badge clickable. Ignored if neither box above is ticked.',
    }),
    defineField({
      name: 'legacyId',
      title: 'Legacy id',
      type: 'number',
      readOnly: true,
      hidden: true,
    }),
    orderRankField({type: 'skill'}),
  ],
  preview: {
    select: {title: 'name', certified: 'certified', completed: 'completed'},
    prepare({title, certified, completed}) {
      const badges = [certified && 'CERTIFIED', completed && 'COURSE'].filter(Boolean)
      return {title, subtitle: badges.join(' · ')}
    },
  },
})
