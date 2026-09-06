import React from 'react';

import { useForm } from '../../hooks/useForm';
import {
  generateAISuggestions,
  improveText,
  type AISuggestion,
} from '../../services/aiSuggestions';
import { Button } from '../common/Button';
import { Card, CardHeader, CardContent } from '../common/Card';

export const AISuggestionsPanel: React.FC = () => {
  const { data, setIntroduction } = useForm();
  const [suggestions, setSuggestions] = React.useState<AISuggestion[]>([]);
  const [generating, setGenerating] = React.useState(false);
  const [applied, setApplied] = React.useState<Set<string>>(new Set());

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const newSuggestions = generateAISuggestions(data);
      setSuggestions(newSuggestions);
      setGenerating(false);
    }, 800);
  };

  const handleApply = (suggestion: AISuggestion) => {
    if (suggestion.type === 'summary' && suggestion.field === 'professionalSummary') {
      setIntroduction({ professionalSummary: suggestion.suggestion });
    }
    setApplied((prev) => new Set([...prev, suggestion.id]));
  };

  const handleImprove = (suggestion: AISuggestion) => {
    const improved = improveText(suggestion.original || suggestion.suggestion, suggestion.field);
    if (suggestion.type === 'summary' && suggestion.field === 'professionalSummary') {
      setIntroduction({ professionalSummary: improved });
    }
    setApplied((prev) => new Set([...prev, suggestion.id]));
  };

  const typeIcons: Record<string, string> = {
    summary: '📝',
    experience: '💼',
    skills: '🛠',
    improvement: '✨',
  };

  const typeLabels: Record<string, string> = {
    summary: 'Summary',
    experience: 'Experience',
    skills: 'Skills',
    improvement: 'Improvement',
  };

  return (
    <Card variant="default" padding="lg">
      <CardHeader
        title="AI-Powered Suggestions"
        subtitle="Get intelligent recommendations to improve your CV content"
        action={
          <Button variant="primary" size="sm" onClick={handleGenerate} disabled={generating}>
            {generating ? 'Analyzing...' : 'Generate Suggestions'}
          </Button>
        }
      />
      <CardContent>
        {suggestions.length === 0 && !generating && (
          <div className="rounded-lg border-2 border-dashed border-slate-200 py-8 text-center dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">
              Click "Generate Suggestions" to get AI-powered recommendations for your CV.
            </p>
          </div>
        )}

        {generating && (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>{suggestions.length} suggestions found</span>
              <span>{applied.size} applied</span>
            </div>
            {suggestions.map((s) => (
              <div
                key={s.id}
                className={`rounded-lg border p-4 transition-colors ${
                  applied.has(s.id)
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span>{typeIcons[s.type]}</span>
                  <span className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">
                    {typeLabels[s.type]}
                  </span>
                  {applied.has(s.id) && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Applied
                    </span>
                  )}
                </div>
                <p className="mb-2 text-sm text-slate-700 dark:text-slate-300">{s.reason}</p>
                {s.original && (
                  <div className="mb-2 rounded bg-red-50 p-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <strong>Current:</strong> {s.original.substring(0, 150)}
                    {s.original.length > 150 ? '...' : ''}
                  </div>
                )}
                <div className="mb-3 rounded bg-green-50 p-2 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  <strong>Suggestion:</strong> {s.suggestion.substring(0, 200)}
                  {s.suggestion.length > 200 ? '...' : ''}
                </div>
                {!applied.has(s.id) && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleApply(s)}>
                      Apply
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleImprove(s)}>
                      Improve
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AISuggestionsPanel;
