import {education} from './education'
import {experience} from './experience'
import {project} from './project'
import {recommendation} from './recommendation'
import {siteSettings} from './siteSettings'
import {skill} from './skill'
import {uiText} from './uiText'

export const schemaTypes = [
  siteSettings,
  uiText,
  project,
  experience,
  education,
  skill,
  recommendation,
]

/** Document types that are singletons: exactly one document, never created or deleted in the Studio. */
export const SINGLETON_TYPES = ['siteSettings', 'uiText'] as const

/** Document types shown as drag-to-reorder lists. */
export const ORDERABLE_TYPES = [
  {type: 'project', title: 'Projects'},
  {type: 'experience', title: 'Experience'},
  {type: 'education', title: 'Education & certifications'},
  {type: 'skill', title: 'Skills'},
  {type: 'recommendation', title: 'Recommendations'},
] as const
