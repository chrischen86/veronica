export const phase1 = '17:00:00.000';
export const phase2 = '01:00:00.000';
export const phase3 = '09:00:00.000';

export const getPhasesTimes = (to: Date, from: Date) => {
  const phases = [];

  let runningDate = to;

  while (runningDate < from) {
    phases.push(runningDate);
    const currentDate = new Date(runningDate);
    currentDate.setHours(currentDate.getHours() + 8);
    runningDate = currentDate;
  }

  return phases;
};

export const getPhases = (to: Date, from: Date) => {
  const phaseStartTimes = getPhasesTimes(to, from);

  const phases = phaseStartTimes.map((p) => {
    const phaseEnd = new Date(p);
    phaseEnd.setHours(phaseEnd.getHours() + 2);
    return { phase: 1, to: p, from: phaseEnd };
  });

  console.log(phases);
  return phases;
};
