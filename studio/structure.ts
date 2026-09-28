import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {CogIcon} from '@sanity/icons/Cog'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import type {StructureResolver} from 'sanity/structure'

import {ORDERABLE_TYPES} from './schemaTypes'

const SINGLETONS = [
  {id: 'siteSettings', title: 'Site settings', icon: CogIcon},
  {id: 'uiText', title: 'Interface text', icon: DocumentTextIcon},
]

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      ...SINGLETONS.map(({id, title, icon}) =>
        S.listItem()
          .title(title)
          .id(id)
          .icon(icon)
          .child(S.document().schemaType(id).documentId(id).title(title))
      ),
      S.divider(),
      ...ORDERABLE_TYPES.map(({type, title}) =>
        orderableDocumentListDeskItem({type, title, S, context})
      ),
    ])
