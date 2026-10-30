import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useGradesStore } from '@/store/grades.store';

import { HomeScreen } from './HomeScreen';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const renderHome = (onOpen = jest.fn()) =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <HomeScreen onOpen={onOpen} />
    </SafeAreaProvider>,
  );

const completeCourse = async (courseId: string, units: Record<string, number>) =>
  await act(() => {
    const s = useGradesStore.getState();
    for (const [id, v] of Object.entries(units)) {
      s.setValue(courseId, id, v);
      s.markReal(courseId, id);
    }
  });

beforeEach(() => useGradesStore.setState({ grades: {} }));

describe('home', () => {
  it('lists the 7 courses with code and credits', async () => {
    await renderHome();
    expect(screen.getAllByRole('button')).toHaveLength(7);
    expect(screen.getByText('Biología Celular y Molecular')).toBeTruthy();
    expect(screen.getByText('0000AGEL0103 · 2 créditos')).toBeTruthy();
  });

  it('shows a dash until a course is complete', async () => {
    await renderHome();
    expect(screen.getByTestId('general-average')).toHaveTextContent('— /20');
    expect(screen.getByText('0 de 7 cursos completos · 0 créditos')).toBeTruthy();
  });

  it('a complete course gets its star and enters the average', async () => {
    await renderHome();
    await completeCourse('gestion-informacion', { u1: 14, u2: 13, u3: 15 }); // 14.1 -> 14
    expect(screen.getByLabelText('Curso completo')).toBeTruthy();
    expect(screen.getByTestId('general-average')).toHaveTextContent('14.00 /20');

    await completeCourse('filosofia-general', { u1: 10, u2: 10, u3: 11 }); // 10.4 -> 10
    expect(screen.getByTestId('general-average')).toHaveTextContent('12.40 /20'); // (14x3 + 10x2) / 5
    expect(screen.getByText('2 de 7 cursos completos · 5 créditos')).toBeTruthy();
  });

  it('simulating without marking real does not change the average', async () => {
    await renderHome();
    await act(() => useGradesStore.getState().setValue('matematica', 'final', 20));
    expect(screen.getByText('20.00')).toBeTruthy();
    expect(screen.getByTestId('general-average')).toHaveTextContent('— /20');
  });

  it('opens a course', async () => {
    const onOpen = jest.fn();
    await renderHome(onOpen);
    await fireEvent.press(screen.getByLabelText('Abrir Sociología'));
    expect(onOpen).toHaveBeenCalledWith('sociologia');
  });
});
