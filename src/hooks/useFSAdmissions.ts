/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { fsService } from '../services/fs/fs.service';
import { FSAdmission, FSAdmissionAdminView, ApplyFSAdmissionPayload, FSAdmissionStatusFilter } from '../types';

export interface UseFSAdmissionsReturn {
  // Student Application State
  isSubmitting: boolean;
  submittedAdmission: FSAdmission | null;
  submitError: string | null;
  submitErrorCode: string | null;
  applyForAdmission: (payload?: ApplyFSAdmissionPayload) => Promise<FSAdmission | null>;
  resetSubmitState: () => void;

  // Coordinator Admissions State
  admissions: FSAdmissionAdminView[];
  isLoadingAdmissions: boolean;
  admissionsError: string | null;
  admissionsErrorCode: string | null;
  fetchAdminAdmissions: (filter?: FSAdmissionStatusFilter | string) => Promise<FSAdmissionAdminView[]>;
}

export function useFSAdmissions(): UseFSAdmissionsReturn {
  // Student state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAdmission, setSubmittedAdmission] = useState<FSAdmission | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitErrorCode, setSubmitErrorCode] = useState<string | null>(null);

  // Coordinator state
  const [admissions, setAdmissions] = useState<FSAdmissionAdminView[]>([]);
  const [isLoadingAdmissions, setIsLoadingAdmissions] = useState(false);
  const [admissionsError, setAdmissionsError] = useState<string | null>(null);
  const [admissionsErrorCode, setAdmissionsErrorCode] = useState<string | null>(null);

  const resetSubmitState = useCallback(() => {
    setSubmittedAdmission(null);
    setSubmitError(null);
    setSubmitErrorCode(null);
  }, []);

  const applyForAdmission = useCallback(async (payload: ApplyFSAdmissionPayload = {}): Promise<FSAdmission | null> => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitErrorCode(null);

    try {
      const result = await fsService.applyForAdmission(payload);
      setSubmittedAdmission(result);
      return result;
    } catch (err: any) {
      const code = err.code || (err.statusCode === 401 ? 'UNAUTHENTICATED' : err.statusCode === 403 ? 'PERMISSION_DENIED' : 'UNKNOWN_ERROR');
      setSubmitErrorCode(code);

      if (code === 'ALREADY_IN_SUBGROUP') {
        setSubmitError('You are already assigned to a fellowship subgroup and therefore cannot apply for Foundational School.');
      } else if (code === 'ADMISSION_ALREADY_PENDING') {
        setSubmitError('You already have a pending Foundational School application awaiting coordinator review.');
      } else if (code === 'VALIDATION_ERROR') {
        setSubmitError(err.message || 'Invalid application data. Please ensure testimony is under 2000 characters.');
      } else if (code === 'UNAUTHENTICATED' || err.statusCode === 401) {
        setSubmitError('Your session has expired or you are not signed in. Please sign in to apply.');
      } else if (code === 'PERMISSION_DENIED' || err.statusCode === 403) {
        setSubmitError(err.message || 'You lack permission to submit this application.');
      } else {
        setSubmitError(err.message || 'Failed to submit application. Please check your network connection and try again.');
      }
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const fetchAdminAdmissions = useCallback(async (filter?: FSAdmissionStatusFilter | string): Promise<FSAdmissionAdminView[]> => {
    setIsLoadingAdmissions(true);
    setAdmissionsError(null);
    setAdmissionsErrorCode(null);

    try {
      const result = await fsService.getAdminAdmissions(filter);
      setAdmissions(result);
      return result;
    } catch (err: any) {
      const code = err.code || (err.statusCode === 403 ? 'PERMISSION_DENIED' : 'FETCH_ERROR');
      setAdmissionsErrorCode(code);
      if (code === 'PERMISSION_DENIED' || err.statusCode === 403) {
        setAdmissionsError('You lack permission to review Foundational School admissions.');
      } else {
        setAdmissionsError(err.message || 'Unable to load admission applications from the server.');
      }
      return [];
    } finally {
      setIsLoadingAdmissions(false);
    }
  }, []);

  return {
    isSubmitting,
    submittedAdmission,
    submitError,
    submitErrorCode,
    applyForAdmission,
    resetSubmitState,

    admissions,
    isLoadingAdmissions,
    admissionsError,
    admissionsErrorCode,
    fetchAdminAdmissions,
  };
}
