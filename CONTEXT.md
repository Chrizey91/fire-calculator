# FIRE Calculator

A browser-based tool that simulates long-term portfolio growth and retirement drawdown, helping users find their FIRE (Financial Independence, Retire Early) number and explore retirement timing scenarios.

## Language

### Inputs

**Current Age**:
The user's age today, in whole years. The starting point of the simulation.
_Avoid_: start age, birth year

**Portfolio Value**:
The current total value of the user's invested assets. Earns ROI from the first simulation year.
_Avoid_: savings, nest egg, balance

**Monthly Savings**:
The amount the user contributes to their portfolio each month, in today's money. Multiplied by 12 for annual simulation steps.
_Avoid_: monthly contribution, deposit

**Savings Growth Rate**:
An annual percentage by which the Monthly Savings amount compounds each year, applied from the current age until the Drawout Date. Represents expected salary growth or contribution increases.
_Avoid_: contribution growth, savings increase

**ROI (Return on Investment)**:
The annual percentage return on the portfolio, applied uniformly during both the Accumulation Phase and the Drawout Phase.
_Avoid_: interest rate, growth rate, return rate

**Inflation Rate**:
The annual percentage increase in prices, used to convert between nominal and real values. User-configurable; defaults to 2%.
_Avoid_: CPI, price growth

**Target Net Monthly Income**:
The amount the user wants available per month in retirement, expressed in today's purchasing power (real terms), after tax deductions. The calculator grosses this up internally to determine the required gross portfolio withdrawal.
_Avoid_: retirement income, withdrawal target, monthly spend

**Deduction Rate**:
The percentage deducted from gross portfolio withdrawals (e.g. capital gains tax, wealth tax). Applied to determine how much must be withdrawn to deliver the Target Net Monthly Income.
_Avoid_: tax rate, withholding

**Additional Retirement Income**:
A fixed monthly amount the user will receive from external sources after the Drawout Date (e.g. state pension, part-time work), entered as a net (after-tax) figure. Defaults to 0.
_Avoid_: pension, external income, side income

### Phases

**Accumulation Phase**:
The period from the user's current age until the Drawout Date. The portfolio grows via ROI and Monthly Savings (compounding by the Savings Growth Rate annually).
_Avoid_: saving phase, growth phase

**Drawout Phase**:
The period from the Drawout Date until age 100. No new savings are added. The portfolio earns ROI but is reduced each year by the gross annual withdrawal required to deliver the Target Net Monthly Income (after accounting for Additional Retirement Income and inflation adjustment). If the portfolio hits zero, it flatlines at zero.
_Avoid_: retirement phase, withdrawal phase, decumulation

**Drawout Date**:
The age at which the user plans to retire, set via the retirement slider. Marks the boundary between the Accumulation Phase and the Drawout Phase.
_Avoid_: retirement age, retirement date, FIRE date

### Calculations

**FIRE Number**:
The portfolio value required at the Drawout Date to sustain the Target Net Monthly Income (in real terms) through age 100, given the configured ROI, inflation rate, deduction rate, and additional retirement income. Computed dynamically by the simulation.
_Avoid_: target portfolio, required nest egg

**Nominal Value**:
A monetary amount expressed in future currency units, not adjusted for inflation. What a number in a future year actually says on paper.
_Avoid_: raw value, unadjusted

**Real Value**:
A monetary amount expressed in today's purchasing power, adjusted for inflation. Comparable to what the user set as their Target Net Monthly Income.
_Avoid_: inflation-adjusted value, constant-dollar

**Runway**:
The number of years the portfolio can sustain withdrawals before reaching zero. Only relevant when the portfolio depletes before age 100.
_Avoid_: portfolio lifetime, depletion age

**Projected FIRE Age**:
The age at which the simulated portfolio value first reaches the FIRE Number during the Accumulation Phase.
_Avoid_: FIRE date, independence age
