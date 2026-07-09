import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizAPI, lessonAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';

type EditableQuestion = {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  points: number;
  explanation: string;
};

const emptyQuestion = (): EditableQuestion => ({
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_answer: 'a',
  points: 1,
  explanation: '',
});

export default function QuizEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [questions, setQuestions] = useState<EditableQuestion[] | null>(null);

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizAPI.getQuiz(Number(id)).then((res) => res.data),
    enabled: !!id,
  });

  const { data: lessons } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => lessonAPI.listLessons().then((res) => res.data),
  });

  const loadedQuestions = useMemo(() => {
    if (!quiz?.questions?.length) return [emptyQuestion()];
    return (
      [...quiz.questions]
        .sort((a: any, b: any) => a.order_index - b.order_index)
        .map((question: any) => {
          const optionMap = Object.fromEntries((question.options || []).map((option: any) => [option.id, option.text]));
          return {
            question_text: question.question_text || '',
            option_a: optionMap.a || '',
            option_b: optionMap.b || '',
            option_c: optionMap.c || '',
            option_d: optionMap.d || '',
            correct_answer: question.correct_answer || 'a',
            points: question.points || 1,
            explanation: question.explanation || '',
          };
        })
    );
  }, [quiz]);

  const activeQuestions = questions || loadedQuestions;

  const updateQuiz = useMutation({
    mutationFn: (data: any) => quizAPI.updateQuiz(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz', id] });
      toast.success('Quiz updated successfully');
      navigate('/admin/quizzes');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update quiz');
    },
  });

  const updateQuestion = (index: number, data: Partial<EditableQuestion>) => {
    setQuestions(activeQuestions.map((item, itemIndex) => (itemIndex === index ? { ...item, ...data } : item)));
  };

  const removeQuestion = (index: number) => {
    setQuestions(activeQuestions.length > 1 ? activeQuestions.filter((_, itemIndex) => itemIndex !== index) : activeQuestions);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payloadQuestions = activeQuestions.map((question, index) => {
      const options = [
        { id: 'a', text: question.option_a.trim() },
        { id: 'b', text: question.option_b.trim() },
        ...(question.option_c.trim() ? [{ id: 'c', text: question.option_c.trim() }] : []),
        ...(question.option_d.trim() ? [{ id: 'd', text: question.option_d.trim() }] : []),
      ];

      return {
        question_type: 'multiple_choice',
        question_text: question.question_text.trim(),
        options,
        correct_answer: question.correct_answer,
        points: Number(question.points || 1),
        order_index: index + 1,
        explanation: question.explanation.trim() || null,
      };
    });

    const invalidQuestion = payloadQuestions.find(
      (question) => !question.question_text || question.options.length < 2 || !question.options.some((option) => option.id === question.correct_answer),
    );
    if (invalidQuestion) {
      toast.error('Every question needs a prompt, at least two options, and a valid correct answer.');
      return;
    }

    updateQuiz.mutate({
      title: formData.get('title'),
      description: formData.get('description'),
      lesson_id: Number(formData.get('lesson_id')),
      passing_score: Number(formData.get('passing_score')),
      max_attempts: Number(formData.get('max_attempts')),
      is_active: formData.get('is_active') === 'on',
      questions: payloadQuestions,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/admin/quizzes')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Quiz</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input name="title" type="text" required defaultValue={quiz.title} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lesson</label>
              <select name="lesson_id" required defaultValue={quiz.lesson_id} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                <option value="">Select a lesson...</option>
                {lessons?.map((lesson: any) => (
                  <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea name="description" rows={3} defaultValue={quiz.description} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
              <input name="passing_score" type="number" min="0" max="100" defaultValue={quiz.passing_score} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Attempts</label>
              <input name="max_attempts" type="number" min="1" defaultValue={quiz.max_attempts} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
            </div>
            <label className="flex items-center gap-2 self-end rounded-lg border border-gray-200 px-4 py-2">
              <input name="is_active" type="checkbox" defaultChecked={quiz.is_active} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>

          <div className="border-t pt-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
              <button type="button" onClick={() => setQuestions([...activeQuestions, emptyQuestion()])} className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                <Plus className="h-4 w-4" />
                Add Question
              </button>
            </div>

            {activeQuestions.map((question, index) => (
              <div key={index} className="rounded-lg border border-gray-200 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Question {index + 1}</h3>
                  <button type="button" onClick={() => removeQuestion(index)} disabled={activeQuestions.length === 1} className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40">
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>

                <textarea value={question.question_text} onChange={(e) => updateQuestion(index, { question_text: e.target.value })} required rows={2} placeholder="Question prompt" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(['a', 'b', 'c', 'd'] as const).map((option) => (
                    <input key={option} value={question[`option_${option}`]} onChange={(e) => updateQuestion(index, { [`option_${option}`]: e.target.value } as Partial<EditableQuestion>)} required={option === 'a' || option === 'b'} placeholder={`Option ${option.toUpperCase()}${option === 'a' || option === 'b' ? '' : ' (optional)'}`} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select value={question.correct_answer} onChange={(e) => updateQuestion(index, { correct_answer: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option value="a">Correct: A</option>
                    <option value="b">Correct: B</option>
                    <option value="c">Correct: C</option>
                    <option value="d">Correct: D</option>
                  </select>
                  <input type="number" min="1" value={question.points} onChange={(e) => updateQuestion(index, { points: Number(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  <input value={question.explanation} onChange={(e) => updateQuestion(index, { explanation: e.target.value })} placeholder="Feedback after submit" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={updateQuiz.isPending} className="flex items-center space-x-2 px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50">
              <Save className="w-5 h-5" />
              <span>{updateQuiz.isPending ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
