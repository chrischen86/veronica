export const phase1 = '17:00:00.000';
export const phase2 = '01:00:00.000';
export const phase3 = '09:00:00.000';

export const getPhasesTimes = (startDate: Date, endDate: Date) => {
  const phases = [];

  let runningDate = startDate;

  while (runningDate < endDate) {
    phases.push(runningDate);
    const currentDate = new Date(runningDate);
    currentDate.setHours(currentDate.getHours() + 8);
    runningDate = currentDate;
  }

  return phases;
};

export const getPhases = (startDate: Date, endDate: Date) => {
  const phaseStartTimes = getPhasesTimes(startDate, endDate);

  const phases = phaseStartTimes.map((p) => {
    const phaseEnd = new Date(p);
    phaseEnd.setHours(phaseEnd.getHours() + 2);
    return { phase: 1, startDate: p, endDate: phaseEnd };
  });

  console.log(phases);
  return phases;
};
