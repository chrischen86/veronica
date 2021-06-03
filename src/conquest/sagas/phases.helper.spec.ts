import { getPhasesTimes } from './phase.helper';

describe('Phase Helper', () => {
  it('get phases for conquest starting phase 1', () => {
    const to = new Date('2021-06-04 17:00:00.000Z');
    const from = new Date('2021-06-07 17:00:00.000Z');
    const phases = getPhasesTimes(to, from);
    expect(phases.length).toBe(9);
  });

  it('get phases for conquest starting phase 2', () => {
    const to = new Date('2021-06-05 01:00:00.000Z');
    const from = new Date('2021-06-08 01:00:00.000Z');
    const phases = getPhasesTimes(to, from);
    expect(phases.length).toBe(9);
  });

  it('get phases for conquest starting phase 3', () => {
    const to = new Date('2021-06-05 09:00:00.000Z');
    const from = new Date('2021-06-08 09:00:00.000Z');
    const phases = getPhasesTimes(to, from);
    expect(phases.length).toBe(9);
  });
});
