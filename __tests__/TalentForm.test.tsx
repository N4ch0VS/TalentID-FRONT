import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TalentForm from '@/components/TalentForm';
import { LanguageProvider } from '@/contexts/LanguageContext';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
};

describe('L1 - TalentForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('Rendering', () => {
    it('renders form with all required fields', () => {
      renderWithProvider(<TalentForm />);
      
      expect(screen.getByPlaceholderText(/E.g. Jane Doe/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Generate Profile/i })).toBeInTheDocument();
    });

    it('renders all 20 enneagram questions', () => {
      renderWithProvider(<TalentForm />);
      
      const questions = screen.getAllByText(/^\d+\./);
      expect(questions).toHaveLength(20);
    });

    it('renders radio buttons for each question', () => {
      renderWithProvider(<TalentForm />);
      
      const radioInputs = screen.getAllByRole('radio');
      expect(radioInputs.length).toBe(100);
    });
  });

  describe('Validation', () => {
    it('shows validation errors when submitting empty form', async () => {
      renderWithProvider(<TalentForm />);
      
      fireEvent.click(screen.getByRole('button', { name: /Generate Profile/i }));
      
      await waitFor(() => {
        expect(screen.getAllByText(/Required/i).length).toBeGreaterThan(0);
      });
    });

    it('shows validation errors for incomplete question answers', async () => {
      renderWithProvider(<TalentForm />);
      
      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '1990-01-01' } });
      
      fireEvent.click(screen.getByRole('button', { name: /Generate Profile/i }));
      
      await waitFor(() => {
        expect(screen.getAllByText(/Required/i).length).toBeGreaterThan(0);
      });
    });
  });

  describe('API Integration', () => {
    const fillAllQuestions = () => {
      const radios = screen.getAllByRole('radio');
      for (let i = 0; i < radios.length; i += 5) {
        fireEvent.click(radios[i + 2]);
      }
    };

    it('calls API on form submission with valid data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          personalityType: 'Type 3',
          competencies: [
            { name: 'Active Listening', value: 85 },
            { name: 'Critical Thinking', value: 90 },
            { name: 'Adaptability', value: 75 },
            { name: 'Communication', value: 80 },
            { name: 'Problem Solving', value: 88 }
          ],
          leadershipStyle: 'Goal-oriented and achievement-focused',
          culturalFit: 'High-performance, fast-paced environment'
        })
      });

      renderWithProvider(<TalentForm />);

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '1990-01-01' } });
      fillAllQuestions();

      fireEvent.click(screen.getByRole('button', { name: /Generate Profile/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/profile', expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('Test User')
        }));
      }, { timeout: 3000 });
    });

    it('handles API error gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' })
      });

      renderWithProvider(<TalentForm />);

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '1990-01-01' } });
      fillAllQuestions();

      fireEvent.click(screen.getByRole('button', { name: /Generate Profile/i }));

      await waitFor(() => {
        expect(screen.getByText(/Error generating profile/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('displays loading state during submission', async () => {
      let resolveFn: (v: any) => void;
      mockFetch.mockImplementation(() => 
        new Promise(resolve => {
          resolveFn = () => resolve({
            ok: true,
            json: () => Promise.resolve({
              personalityType: 'Type 3',
              competencies: [],
              leadershipStyle: 'Test',
              culturalFit: 'Test'
            })
          });
        })
      );

      renderWithProvider(<TalentForm />);

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '1990-01-01' } });
      fillAllQuestions();

      fireEvent.click(screen.getByRole('button', { name: /Generate Profile/i }));

      await waitFor(() => {
        expect(screen.getByText(/Processing.../i)).toBeInTheDocument();
      });

      await act(async () => {
        await resolveFn!();
      });
    });
  });

  describe('Profile Display', () => {
    const fillAllQuestions = () => {
      const radios = screen.getAllByRole('radio');
      for (let i = 0; i < radios.length; i += 5) {
        fireEvent.click(radios[i + 2]);
      }
    };

    it('displays profile data after successful submission', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          personalityType: 'Enneagram Type 3 - The Achiever',
          competencies: [
            { name: 'Active Listening', value: 85 },
            { name: 'Critical Thinking', value: 90 },
            { name: 'Adaptability', value: 75 },
            { name: 'Communication', value: 80 },
            { name: 'Problem Solving', value: 88 }
          ],
          leadershipStyle: 'Goal-oriented and achievement-focused leader',
          culturalFit: 'High-performance, fast-paced environment'
        })
      });

      renderWithProvider(<TalentForm />);

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '1990-01-01' } });
      fillAllQuestions();

      fireEvent.click(screen.getByRole('button', { name: /Generate Profile/i }));

      await waitFor(() => {
        expect(screen.getByText(/Enneagram Type 3/i)).toBeInTheDocument();
        expect(screen.getByText(/Active Listening/i)).toBeInTheDocument();
        expect(screen.getByText(/Goal-oriented/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });
});