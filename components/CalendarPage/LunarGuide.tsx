import type { CalendarLunarGuideSection } from "@/lib/calendar-sections";

type LunarGuideProps = {
  guide: CalendarLunarGuideSection;
};

export function LunarGuide({ guide }: LunarGuideProps) {
  return (
    <section className="moon-cal-guide" aria-labelledby="lunar-guide-title">
      <h2 id="lunar-guide-title" className="moon-cal-guide-title">
        {guide.title}
      </h2>
      {guide.subtitle ? (
        <p className="moon-cal-guide-subtitle">{guide.subtitle}</p>
      ) : null}

      <ul className="moon-cal-guide-phases">
        {guide.phases.map(phase => (
          <li key={phase.id} className="moon-cal-guide-phase">
            <img
              src={phase.imageSrc}
              alt=""
              width={56}
              height={56}
              className="moon-cal-guide-phase-img"
            />
            <div>
              <h3 className="moon-cal-guide-phase-label">{phase.label}</h3>
              <p className="moon-cal-guide-phase-body">{phase.body}</p>
            </div>
          </li>
        ))}
      </ul>

      {guide.tips.length > 0 ? (
        <div className="moon-cal-guide-block">
          <h3 className="moon-cal-guide-block-title">Ещё правила</h3>
          <ul className="moon-cal-guide-tips">
            {guide.tips.map(tip => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {guide.zodiacGroups.length > 0 ? (
        <div className="moon-cal-guide-block">
          <h3 className="moon-cal-guide-block-title">Знаки зодиака для посева</h3>
          <ul className="moon-cal-guide-zodiac">
            {guide.zodiacGroups.map(group => (
              <li key={group.id} className="moon-cal-guide-zodiac-item">
                <p className="moon-cal-guide-zodiac-label">{group.label}</p>
                <p className="moon-cal-guide-zodiac-signs">
                  {group.signs.map(sign => (
                    <span key={sign.name} className="moon-cal-guide-zodiac-sign">
                      <span aria-hidden="true">{sign.symbol}</span> {sign.name}
                    </span>
                  ))}
                </p>
                <p className="moon-cal-guide-zodiac-body">{group.body}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
