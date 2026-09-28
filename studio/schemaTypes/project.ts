import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stack',
      title: 'Stack',
      type: 'string',
      description: 'Rendered after the "Stack: " label. Plain comma-separated text.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Icon',
      type: 'image',
      description: 'Optional. The card renders without an image if this is empty.',
    }),
    defineField({
      name: 'projectUrl',
      title: 'Project link',
      type: 'url',
      description: 'Where the card links to.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Demo video link',
      type: 'url',
      description: 'Optional. Adds the "Demo" button to the card.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description:
        'The single large project at the top of the card. Exactly one project should have this on.',
      initialValue: false,
      validation: (rule) =>
        rule.custom(async (value, context) => {
          if (!value) return true
          const client = context.getClient({apiVersion: '2024-01-01'})
          const id = context.document?._id.replace(/^drafts\./, '')
          const others = await client.fetch<string[]>(
            `*[_type == "project" && featured == true && !(_id in [$id, $draftId])]._id`,
            {id, draftId: `drafts.${id}`}
          )
          return others.length === 0
            ? true
            : 'Another project is already featured. Turn that one off first.'
        }),
    }),
    defineField({
      name: 'legacyId',
      title: 'Legacy id',
      type: 'number',
      description: 'The id this project had in the old hardcoded array. Migration only.',
      readOnly: true,
      hidden: true,
    }),
    orderRankField({type: 'project'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'stack', media: 'image', featured: 'featured'},
    prepare({title, subtitle, media, featured}) {
      return {
        title: featured ? `★ ${title}` : title,
        subtitle,
        media,
      }
    },
  },
})
