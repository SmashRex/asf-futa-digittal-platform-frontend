/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 
  | 'Member'
  | 'Regular Member'
  | 'FS Student'
  | 'FS Teacher'
  | 'VP / FS Coordinator'
  | 'Bible Study Coordinator'
  | 'Choir Coordinator'
  | 'Publicity Coordinator'
  | 'General Secretary'
  | 'Organizing Coordinator'
  | 'Drama Coordinator'
  | 'Prayer Coordinator'
  | 'Financial Secretary'
  | 'Treasurer'
  | 'Librarian'
  | 'President / Executive'
  | 'Technical Administrator'
  | 'Alumni';

export enum RoleLevel {
  PUBLIC = 0,
  MEMBER = 10,
  FS_STUDENT = 15,
  FS_TEACHER = 20,
  EXECUTIVE = 30,
  PUBLICITY_COORDINATOR = 40,
  ADMIN = 50,
}
