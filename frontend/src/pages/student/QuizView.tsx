import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertCircle, ArrowLeft, Award, CheckCircle2, ClipboardCheck, Clock, Send, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { quizAPI } from '../../lib/api';
import { useStudentTheme } from '../../lib/theme';

interface QuizOption {
  id?: string;
  text?: string;
  image_url?: string;
}

interface QuizQuestion {
  id: number;
  question_type: string;
  question_text: string;
  image_url?: string;
  options: QuizOption[] | string[];
  points: number;
  order_index: number;
}

interface AnswerResult {
  question_id: number;
  selected_answer: string;
  is_correct: boolean;
  correct_answer: string;
  points_earned: number;
  explanation?: string;
}

const optionId = (option: QuizOption | string, index: number) =>
  typeof option === 'string' ? String(index) : option.id || String(index);

const optionText = (option: QuizOption | string) =>
  typeof option === 'string' ? option : option.text || option.id || '';

const optionImage = (option: QuizOption | string) =>
  typeof option === 'string' ? undefined : option.image_url;

export default function QuizView() {
  const { id } = useParams();
  const quizId = Number(id);
  const navigate = useNavigate();
  const theme = useStudentTheme();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['studentQuiz', quizId],
    queryFn: () => quizAPI.getStudentQuiz(quizId).then((res) => res.data),
    enabled: Number.isFinite(quizId),
  });

  const questions = useMemo(
    () => [...((quiz?.questions || []) as QuizQuestion[])].sort((a, b) => a.order_index - b.order_index),
    [quiz?.questions],
  );

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;
  const resultByQuestion = useMemo(() => {
    const pairs = ((result?.answers || []) as AnswerResult[]).map((answer) => [answer.question_id, answer] as const);
    return new Map(pairs);
  }, [result?.answers]);

  const startAttempt = useMutation({
    mutationFn: () => quizAPI.startQuiz(quizId),
    onSuccess: (response) => {
      setAttemptId(response.data.id);
      setResult(null);
      setAnswers({});
      toast.success('Assessment started');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Could not start assessment');
    },
  });

  const submitAttempt = useMutation({
    mutationFn: () => {
      if (!attemptId) {
        throw new Error('Start the assessment before submitting.');
      }

      return quizAPI.submitQuiz(
        attemptId,
        quizId,
        Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          question_id: Number(questionId),
          selected_answer: selectedAnswer,
        })),
      );
    },
    onSuccess: (response) => {
      setResult(response.data);
      toast.success('Assessment submitted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || error.message || 'Could not submit assessment');
    },
  });

  const selectAnswer = (questionId: number, selectedAnswer: string) => {
    if (result) return;
    setAnswers((current) => ({ ...current, [questionId]: selectedAnswer }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme.primary.replace('bg-', 'border-')}`} />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Assessment not found</h2>
        <button onClick={() => navigate('/student/lessons')} className={`mt-4 ${theme.primary} text-white px-6 py-2 rounded-lg`}>
          Back to Lessons
        </button>
      </div>
    );
  }

  const isReadyToSubmit = attemptId && questions.length > 0 && answeredCount === questions.length;

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <button
        onClick={() => navigate('/student/lessons')}
        className={`inline-flex items-center gap-2 ${theme.textSecondary} hover:${theme.text} transition-colors`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to lessons
      </button>

      <div className={`${theme.cardBg} border border-slate-200 rounded-lg shadow-sm`}>
        <div className="border-b border-slate-200 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className={`inline-flex items-center gap-2 text-sm font-semibold ${theme.primary.replace('bg-', 'text-')} mb-3`}>
                <ClipboardCheck className="w-4 h-4" />
                Self Assessment
              </div>
              <h1 className={`text-3xl font-bold ${theme.text}`}>{quiz.title}</h1>
              {quiz.description && <p className={`${theme.textSecondary} mt-2 max-w-3xl`}>{quiz.description}</p>}
            </div>

            <div className="grid grid-cols-3 gap-3 text-center min-w-[280px]">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Questions</p>
                <p className="text-xl font-bold text-slate-900">{questions.length}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Passing</p>
                <p className="text-xl font-bold text-slate-900">{Math.round(quiz.passing_score)}%</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Attempts</p>
                <p className="text-xl font-bold text-slate-900">{quiz.max_attempts || '∞'}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
              <span>{answeredCount} of {questions.length} answered</span>
              <span>{progress}% complete</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div className={`h-2 rounded-full ${theme.primary} transition-all`} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {!attemptId && !result && (
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-slate-500 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">Ready when you are</p>
                <p className="text-sm text-slate-600">Start creates a fresh attempt. Submit when every question has an answer.</p>
              </div>
            </div>
            <button
              onClick={() => startAttempt.mutate()}
              disabled={startAttempt.isPending || questions.length === 0}
              className={`${theme.primary} text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50`}
            >
              {startAttempt.isPending ? 'Starting...' : 'Start Assessment'}
            </button>
          </div>
        )}

        {questions.length === 0 ? (
          <div className="p-10 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-slate-900">No questions yet</h2>
            <p className="text-slate-600 mt-2">Ask a teacher to add questions before taking this assessment.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {questions.map((question, questionIndex) => {
              const selectedAnswer = answers[question.id];
              const reviewedAnswer = resultByQuestion.get(question.id);

              return (
                <section key={question.id} className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-500 mb-2">
                        Question {questionIndex + 1} • {question.points} point{question.points === 1 ? '' : 's'}
                      </p>
                      <h2 className="text-lg font-bold text-slate-950">{question.question_text}</h2>
                      {question.image_url && (
                        <img src={question.image_url} alt="" className="mt-4 max-h-72 rounded-lg border border-slate-200 object-contain" />
                      )}
                    </div>

                    {reviewedAnswer && (
                      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                        reviewedAnswer.is_correct ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {reviewedAnswer.is_correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {reviewedAnswer.points_earned} / {question.points}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 grid gap-3">
                    {question.options.map((option, optionIndex) => {
                      const id = optionId(option, optionIndex);
                      const text = optionText(option);
                      const image = optionImage(option);
                      const isSelected = selectedAnswer === id;
                      const isCorrectAnswer = reviewedAnswer?.correct_answer === id;
                      const isIncorrectSelection = reviewedAnswer && isSelected && !reviewedAnswer.is_correct;

                      return (
                        <button
                          key={id}
                          type="button"
                          disabled={!attemptId || !!result}
                          onClick={() => selectAnswer(question.id, id)}
                          className={`text-left rounded-lg border p-4 transition-all ${
                            isCorrectAnswer
                              ? 'border-emerald-400 bg-emerald-50'
                              : isIncorrectSelection
                                ? 'border-rose-300 bg-rose-50'
                                : isSelected
                                  ? 'border-sky-500 bg-sky-50'
                                  : 'border-slate-200 bg-white hover:border-slate-300'
                          } ${!attemptId ? 'opacity-70' : ''}`}
                        >
                          <div className="flex gap-3">
                            <div className={`mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center ${
                              isCorrectAnswer
                                ? 'border-emerald-500 bg-emerald-500'
                                : isSelected
                                  ? 'border-sky-600 bg-sky-600'
                                  : 'border-slate-300'
                            }`}>
                              {(isSelected || isCorrectAnswer) && <div className="h-2 w-2 rounded-full bg-white" />}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900">{text}</p>
                              {image && <img src={image} alt="" className="mt-3 max-h-40 rounded-md border border-slate-200 object-contain" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {reviewedAnswer?.explanation && (
                    <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 p-4">
                      <p className="text-sm font-semibold text-slate-900">Feedback</p>
                      <p className="text-sm text-slate-700 mt-1">{reviewedAnswer.explanation}</p>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        <div className="border-t border-slate-200 p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-slate-50">
          {result ? (
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                result.is_passed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-950">
                  Score: {Math.round(result.score || 0)}% • {result.is_passed ? 'Passed' : 'Needs review'}
                </p>
                <p className="text-sm text-slate-600">
                  {result.total_points || 0} of {result.max_points || 0} points earned
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              {attemptId ? 'Your answers are saved on this page until you submit.' : 'Start the assessment to enable answers.'}
            </p>
          )}

          <div className="flex gap-3">
            {result && (
              <button
                onClick={() => {
                  setAttemptId(null);
                  setResult(null);
                  setAnswers({});
                }}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-white"
              >
                Try Again
              </button>
            )}
            {!result && (
              <button
                onClick={() => submitAttempt.mutate()}
                disabled={!isReadyToSubmit || submitAttempt.isPending}
                className={`${theme.primary} inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50`}
              >
                <Send className="w-4 h-4" />
                {submitAttempt.isPending ? 'Submitting...' : 'Submit Assessment'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
