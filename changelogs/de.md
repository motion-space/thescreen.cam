# 1.1.0

- Benutzerdefinierte Hintergründe für Screen und Mockups unterstützen jetzt flüssig wiederholte Videos mit einstellbarer Wiedergabegeschwindigkeit von 0,1× bis 2× in Vorschau und Export.
- ScreenCam ist jetzt ausschließlich für Macs mit Apple Chip ausgelegt und benötigt deutlich weniger Speicherplatz.
- Hochauflösende benutzerdefinierte Videohintergründe bleiben in der Vorschau flüssig und werden deutlich schneller exportiert.
- Die Wiedergabevorschau hält Cursorbewegungen synchron, während Zoom und Kamerabewegung auch bei Geschwindigkeitsänderungen flüssig bleiben.
- Die Schaltflächen für Seitenverhältnis und Zuschnitt ziehen das Editorfenster nicht mehr mit.
- Manuelle Zoom-Clips bleiben bis zum Ende des Herauszoomens ruhig, auch wenn der Fokus nahe am Bildrand liegt.
- Schatten lassen sich jetzt über haptische zweidimensionale Felder steuern, deren Richtung, Versatz, Unschärfe und Stärke an die Bildgröße angepasst sind.
- Die Fenstereinstellungen bieten jetzt anpassbare Eckenglättung sowie konfigurierbare Rahmenbreite und -farbe, ohne die Geometrie des aufgenommenen Inhalts zu verändern, und halten Kanten bei jeder Zoomstufe scharf.
- Screen-Rahmen behalten auf hellen Hintergründen glatte Ecken, saubere Kanten und gut sichtbare Schatten.
- Quick Focus bietet anpassbare Tastenkürzel, interaktiven gesperrten Zoom mit Navigation durch Schieben am Rand und nahtlosem Wechsel der Zoomstufe sowie optionales ProMotion-Rendering mit bis zu 120 Hz.
- Benutzerdefinierte Schieberegler, ziehbare Zahleneingaben und präzise Editorinteraktionen geben jetzt haptisches Trackpad-Feedback.
- Tastatur-Overlays zeigen die richtige Basistaste und halten gedrückte Tasten bis zum Loslassen stabil.
- Exporte schlagen nicht mehr fehl, wenn eine aufgezeichnete Audiospur deaktiviert ist.
- Die Aufnahmesymbolleiste bleibt bei vertikal angeordneten Monitoren auf dem richtigen Display.
- Manuelle Zoom-Clips verwenden jetzt einen einzigen Mittelpunkt und Zoomfaktor; die Minikarte befindet sich in den Clip-Einstellungen.
- Benachbarte Zoom-Clips verschieben und skalieren jetzt gemeinsam, ohne zusammengeführt oder auf 1x zurückgesetzt zu werden.
- Vergrößerte Vorschauen bewahren Quelldetails bei jeder Editorfenstergröße.
- Hover-Vorschauen in der Timeline bleiben über Zoom-Clip-Grenzen hinweg reaktionsschnell.

# 1.0.9

- Manuelle Zoom-Anker verwenden jetzt reaktionsschnelle 1:1-Leinwandsteuerelemente mit einer am Rendering ausgerichteten Minikarte.
- Voreinstellungen halten benutzerdefinierte Hintergründe und Hintergrundbilder projektübergreifend, nach Neustarts und beim Teilen verfügbar.
- Vergrößerte Vorschauen zeigen Quelltext auch in kleineren Editorfenstern scharf.
- Allgemeine Display-Mockups lassen sich mit Rahmenbreite, inneren und äußeren Eckenradien, Ständerstil und Ständergröße anpassen.
- Exporte prüfen vor dem Rendern den verfügbaren Speicherplatz, um späte Abbrüche zu vermeiden.
- Bildschirm- und iPhone-Aufnahmen mit hoher Bildrate halten die Audiowiedergabe reaktionsschnell und reduzieren überflüssige, wartende und gerenderte Frames.
- Zugeschnittene Video-, GIF- und Live-Photo-Exporte beginnen die Decodierung nahe dem ausgewählten Bereich; bei reinen Audioänderungen kann bereits gerendertes Video wiederverwendet werden.
- Vorschau, Timeline, Cursor, Wellenform, Untertitel, Kamera-Overlay und Projektverarbeitung verwenden begrenzte Caches und gemeinsam genutzte Arbeit, damit lange Aufnahmen flüssiger laufen.
- GIF- und parallele Exporte verwenden begrenzte Pipelines und eine fairere Ressourcenplanung, um Konkurrenz zu verringern.
- Timeline-Hover-Vorschauen springen beim vertikalen Wechsel zwischen Clips nicht mehr zum Playhead-Frame zurück.
- Beim Ziehen des Timeline-Playheads während der Wiedergabe pausiert die Wiedergabe und läuft nach dem Loslassen weiter.
- Timeline-Hover-Cursor, Scrub-Playheads und Linealbeschriftungen reagieren bei Vorschauaktualisierungen, Wiedergabe und Zoomgrenzen flüssiger.

# 1.0.8

- Aufzeichnungen können in einer schwebenden Schnellaktionskarte mit gerenderten Vorschau-Miniaturansichten, Wiedergabe-vom-Start-Vorschau, Bearbeitung, Voreinstellung, Export, Speichern, Quellenspeicherung und Entwurfsaktionen abgeschlossen werden.
- Das Entfernen des Kamerahintergrunds unterstützt das Styling von zwischengespeicherten Aufklebern mit anpassbarer Umriss-, Schatten- und Rahmenvorschau im Hochformat.
- Mit den Darstellungseinstellungen können Sie den Editor, die Inspektorfelder, die Exportoberflächen, die Aufzeichnungssymbolleiste, die Tooltips und die Materialvorschau zwischen dunklem, hellem und automatischem Modus umschalten.
- Die App-Spracheinstellungen unterstützen jetzt Traditionelles Chinesisch, Spanisch, Französisch, brasilianisches Portugiesisch und Italienisch.
- Kamera-Overlays unterstützen mehr Seitenverhältnisse, Hintergrundentfernung mit Inline-Fortschritt, transparenten Porträtmodus, verpackte benutzerdefinierte Bildhintergründe und das Kopieren von Einstellungen mit einem Klick in jeden Kameraclip.
- Schnellaktionskarten werden während der Aufnahmeauswahl ausgeblendet, kehren nach der Aufnahme oder dem Abbruch zurück, folgen der aktiven Anzeige und sorgen dafür, dass jede sichtbare Karte anklickbar bleibt.
- Transparente Porträtkamera-Overlays werden korrekt exportiert, Verlaufshintergrundänderungen aktualisieren die Vorschau sofort, manuelle Zoomanker bleiben sichtbar, das Ziehen bei der Zahleneingabe bleibt über die Bildschirmränder hinweg stabil und der Kaufbildschirm folgt dem ausgewählten Erscheinungsbild.

# 1.0.7

- Untertitel unterstützen die Transkription von Anbietern und lokalen Modellen, bearbeitbare Mitlesesegmente, Sichtbarkeit pro Untertitel, voreingestellte Stile und übersichtlichere Exporthintergründe.
- Untertitelhintergründe unterstützen Unschärfe und Flüssigglasmaterialien mit einstellbarer Unschärfe, Sättigung, Glasstil und Farbton.
- Kamera-Overlays unterstützen eine einstellbare Eckenglättung und einen weicheren quadratischen Standardstil.
- Effektebenen werden jetzt im gesamten Editor als „Annotation“ bezeichnet.
- Mit den Editoreinstellungen können Sie Funktionseinträge neu anordnen und ausblenden, wobei Animation, Tastatur und Schönheit standardmäßig ausgeblendet werden und zusätzliche ausgeblendete Einträge unter More gesammelt werden.
- Aufnahmen warten auf aktivierte Bildschirm-, Mikrofon- und System-Audioeingänge, bevor sie auf Medien geschrieben werden, und verzögerte Audio-Sidecars bleiben in Vorschau, Export, Timeline-Clips und Wellenformen ausgerichtet.
- Die Kamerabereinigung nach frühen Aufnahmefehlern stürzt nicht mehr ab, und bei Schreibfehlern bei geringem Speicherplatz werden wiederherstellbare Medien mit einer deutlichen Warnung angezeigt.
- Deaktivierte Tastaturtasten bleiben nach dem erneuten Öffnen von Projekten verborgen, einschließlich Vorschau und Export.
- Beim Öffnen und Exportieren von ProProjekten werden die ersten Videobilder zuverlässig wiedergegeben, und dichte Untertitel- und Zeitleistengruppen werden nach einem tieferen Zoom korrekt getrennt.
- Timeline-Hover-Cursor, Scrub-Abspielköpfe und Zoom-Anker bleiben während der Wiedergabe, beim Ziehen, Scrollen und Zoomen stabil.
- Die Remote-Untertiteltranskription lädt optimiertes temporäres Audio hoch, um die Anfragegröße zu reduzieren und die Dateigrößenbeschränkungen des Anbieters früher zu erkennen.
- Kamera-Overlay-Vorschauen, dichte Timeline-Spuren und die Bearbeitung von Untertitelsegmenten reagieren bei langen Aufnahmen schneller.

# 1.0.6

- Aufzeichnungen können über die Symbolleiste, die Menüleiste oder CLI angehalten und fortgesetzt werden, wobei die angehaltene Zeit im gespeicherten Arbeitsbereich weggelassen wird.
- Bildeffektebenen können ein- und ausgeblendet werden oder Eingangs- und Ausgangsanimationen überspringen.
- Der Titel des Editor-Headers öffnet Arbeitsbereichsoptionen zum Umbenennen und Anzeigen der Datei .cam in Finder.
- Crop Source kann Quellabmessungen nach Verhältnis, Breite oder Höhe skalieren.
- Screen Size-Polsterung kann pro Kante mit einem höheren maximalen Bereich angepasst werden, und Device Padding unterstützt negative Offsets bis zu 3000 Pixel.
- Entwurfsaufzeichnungen bleiben von den gespeicherten .cam-Arbeitsbereichen getrennt, behalten die Speicher-/Löschoptionen in der Nähe bei, erscheinen in „Zuletzt verwendet“ und werden in ausgewählten Ordnern ohne wiederholte Autorisierung oder Fehler aufgrund fehlender Medien gespeichert.
- H.264-Bildschirmaufzeichnungen starten zuverlässig auf Systemen, die nicht unterstützte Bildraten-Encoder-Hinweise ablehnen.
- Das Rendern des Editor-Rückgängigmachens und des Vorschau-Cursors ist bei wiederholtem Rückgängigmachen und vorübergehenden Layoutaktualisierungen zuverlässiger.
- Kamera-Overlays werden nicht mehr schwarz, nachdem ein Aufnahmeclip auf die Mindestlänge zugeschnitten und rückgängig gemacht wurde.
- Vorschauen zur Erstellung von Zoomspuren erstellen den Zoomclip, wenn darauf geklickt wird.
- Cursor-Klickeffekte bleiben bei rotierenden iPhone-Modellen ausgerichtet.
- Mockup-Kanten verbergen dünne Lücken, ohne die Aufnahme zu überzeichnen.
- Cursor-Klickeffekte sind standardmäßig deaktiviert und angeklickte Cursor werden deutlicher verkleinert.
- Aufgezeichnete Cursorformen behalten mehr Systemzustände bei, wobei benutzerdefinierte Cursorstile für nicht unterstützte Formen auf den Standardzeiger zurückgreifen.
- Die Aufnahme-Symbolleiste öffnet sich nach dem Wechseln der Desktop-Bereiche zuverlässig über die Dock-Menüleiste und Verknüpfungen und behält ihr Glas und ihre Position während der Audioaufnahme und -aufzeichnung bei.
- Bei der Fensteraufzeichnungsauswahl bleibt eine kompakte Symbolleistenaufforderung mit anklickbaren Esc-Beenden-Steuerelementen erhalten.
- Die Click-Sound-Vorschauwiedergabe reagiert auch bei Aufnahmen mit dichtem Cursor-Ereignisverlauf.

# 1.0.5

- Exporte können im Hintergrund mit Schätzungen der verbleibenden Zeit, einer anpassbaren Notch-Fortschrittsoberfläche, abgeschlossenen Exportaktionen und einer Fensterwiederherstellung im Genie-Stil fortgesetzt werden.
- Die Timeline-Aufteilung verfügt über einen speziellen Modus mit Option Hold, einem Scheren-Cursor und einem verknüpften Aufnahme-Audio-Fokus.
- Mit den Cursoreinstellungen können Sie einen inaktiven Cursor ausblenden und herunterladbare Klickgeräusche verwenden, die in der Vorschau und im Export abgespielt werden, wobei heruntergeladene Geräusche offline verfügbar sind.
- Mockup-Assets können aus dem Katalog heruntergeladen und aktualisiert werden, wobei Serie, Modell, Farbe sowie Apple Watch-Gehäuse- und Bandauswahl in der Vorschau angezeigt werden.
- Beim GIF-Export werden vor dem Export Voreinstellungen für die Auflösung 1080p und niedriger sowie die geschätzte Dateigröße hinzugefügt.
- Vorhandene Arbeitsbereiche behalten ihr ausgewähltes Modell, während der Download migrierter Assets abgeschlossen ist.
- GIF-Exporte bewahren helle UI-Farben und Effektebenengeometrie genauer.
- Durch das Umschalten zwischen GIF- und Live Photo-Export bleibt die Trimmvorschau stabil und der GIF-Formatselektor reagiert über das gesamte Segment.
- Sehr kurze Timeline-Clips lassen sich einfacher auswählen, ohne sie versehentlich zuzuschneiden.
- Downloads von Mockup-Katalogen verbrauchen weniger Speicher und lange GIF-Exporte weisen weniger Bildpuffer zu.

# 1.0.4

- Vorschau-Overlays verfügen über quadratische Größenänderungsgriffe, Kantenänderung, Größenänderung mit Modifikatortasten und direktes Ziehen des Eckenradius.
- Fokuseffekte können beim Bearbeiten von Mockup-Aufnahmen das gesamte Bild abdecken.
- Effektclips zeigen Typsymbole an, können umbenannt werden und verwenden Textinhalte als Beschriftungen, wenn sie nicht benannt sind.
- ScreenCam kann eigene App-Fenster auswählen und aufzeichnen.
- Der Kaufbildschirm bietet neben Abonnements auch einen einmaligen ScreenCam Pro Lifetime-Kauf an.
- Das Ziehen und Ändern der Größe des Vorschau-Overlays bleibt während des Kamerazooms und der automatischen Skalierung der Kamera genau.
- Texteffekte behalten ihre konfigurierte Schriftgröße bei, wenn die Größe von Textfeldern verkleinert wird.
- Fokuseffektmasken passen besser zu den Ecken und Auswahlumrissen des Mockup-Bildschirms.
- Umbenannte Arbeitsbereichspakete werden weiterhin automatisch gespeichert, ohne Warnungen zu fehlenden Medien.
- Die Menüs der Aufnahmegeräte werden aktualisiert, wenn Mikrofone oder Kameras angeschlossen oder entfernt werden.
- Zugeschnittene Masteraufnahmen können auf ihre ursprüngliche Länge zurückgezogen werden und dichte Zeitleisten scrollen vertikal in kurzen Editorfenstern.
- Die Symbolleiste „Arbeitsbereich öffnen“ wird im Standard-Arbeitsbereichsordner für Aufzeichnungen gestartet.

# 1.0.3

- Effektebenen können Mosaik-, Fokus-, Text- und Bildclips aus einem kompakten Vorschauraster hinzufügen, mit mehrspuriger Timeline-Platzierung und Export-Rendering.
- Die Effektbearbeitung ist präziser durch fokussierte Textbearbeitung, stabiles gezoomtes Textlayout, Platzierung außerhalb des Bildschirms, Größenänderung der Vorschau, zoomfähige Bearbeitung und Live-Bildvorschau in den Ecken.
- Die Größe des Timeline-Spurbereichs kann geändert werden, wobei die Vorschau sichtbar bleibt und leerer Spurraum vermieden wird.
- CLI-Arbeitsbereichsbefehle können Effektclips erstellen und aktualisieren.
- Über die Einstellungen kann das Änderungsprotokoll der Website geöffnet werden.
- Zu den Tastaturereigniseinstellungen gehört ein Schalter „Alle aktivieren“ für ausgewählte Tasten.
- Aufgezeichnete Systemaudio- und Mikrofonspuren können auf über 100 % angehoben werden.
- Aufgezeichnete Systemaudio- und Mikrofonclips bleiben mit den Aufnahmeaufteilungen, Trimmungen und Geschwindigkeitsänderungen im Einklang, mit stabiler Vorschau- und Exportlautstärke.
- Mikrofonanzeigen werden bei der Aufnahme von 24-Bit-Eingabegeräten korrekt animiert.
- Die Standardeinstellungen für Kameraanimationen beginnen mit einem weicheren Federprofil.
- Die Schönheit einer Kamera beginnt mit einem stärkeren, natürlicheren Standard-Look.
- Hintergrundmusik kann durchsucht, in der Vorschau angezeigt, aus dem Katalog oder aus Dateien importiert, pro Clip angepasst und mit der Audioaufnahme exportiert werden.
- Bei neu abgeschlossenen Aufnahmen wird die Editor-Vorschau zuverlässiger wiederhergestellt, einschließlich Änderungen beim Laden von Hintergrundbildern und bei der Auswahl von Videohintergrundbildern.
- Editor-Vorschau- und Mockup-Exporte stimmen besser mit der endgültigen Ausgabe überein, einschließlich Kanten, Textlayout und Timing der Zoom-Animation.
- Bei gezoomten Timeline-Spuren bleiben Lineale, Abspielköpfe, Hover-Vorschauen und Clip-Cursor beim horizontalen Scrollen ausgerichtet und der linke Rand wird beim Zurückzoomen auf 00:00 zurückgesetzt.
- Die Editor-Vorschau schaltet das Systemaudio vollständig stumm, wenn der Clip oder die Spur deaktiviert oder gelöscht wird.
- Effektvorschau, Zoomwiedergabe, Export und Bearbeitung großer Arbeitsbereiche sind auf dichten Zeitleisten schneller.

# 1.0.2

- Support- und Dokumentationslinks sind in den Einstellungen, Info und im Hilfemenü verfügbar.
- Die Animationseinstellungen zeigen zuerst Bewegung an und unterstützen zusammenklappbare Gruppen.
- Editor-Zahleneingaben verwenden Symbolziehgriffe und übernehmen eingegebene Werte, wenn Sie außerhalb des Felds klicken.
- Screen Size warnt vor dem Export schwarzer Balken, wenn der Hintergrund „Keine“ ist, und kann diese entfernen.
- Feste Bildschirmabmessungen werden bei gesperrten Verhältnissen korrekt verkleinert, mit natürlicher Höhenverschiebung.
- Zoom-Clips unterstützen Skalierungsstufen bis zum Fünffachen mit gleichmäßigeren manuellen Zoomübergängen.
- Die Vorschau der Aufnahmekamera erklärt, dass sie nur als Vorschau dient und für zukünftige Aufnahmen ausgeblendet werden kann.
- Manueller Zoom, benutzerdefinierte Hintergrundauswahl, Ausrichtung von Tastaturereignissen und Bearbeitung des Quellenzuschnitts sind zuverlässiger.
- Camera Beauty verbraucht weniger CPU bei der Aufzeichnung von Vorschauen und der Editor-Vorschau-Wiedergabe.
- Die Vorschauwiedergabe blockiert nicht mehr das Schließen des Editors oder native Dateifenster bei umfangreichem zusammengesetzten Rendering.
- Kameraschönheitsanpassungen verhindern eine außer Kontrolle geratene CPU-Auslastung in der Vorschau.
- Camera Beauty sorgt für eine natürliche lokale Lippentönung, eine gleichmäßigere Beleuchtung und eine bessere Behandlung von Hautunreinheiten.
- Automatisch gespeicherte .cam-Arbeitsbereiche behalten den Ordnerzugriff bei, sodass Editor-Speicherungen und -Schließungen an geschützten Speicherorten zuverlässiger sind.
- Kamera-Beauty-Exporte werden schneller abgeschlossen, insbesondere bei kleineren Kamera-Overlays und einer Ausgabe mit niedrigerer Auflösung.
- Seitenverhältnismenüs zeigen Formvorschauen für jede Voreinstellung an.
- Editor-Voreinstellungen werden gespeichert, ohne dass das Voreinstellungsmenü abstürzt.
- Bei Gerätemodellen wird die Bildschirmöffnung bei Bedarf verkleinert, sodass die Aufzeichnungen den Bildschirm ohne Letterboxing bedecken.
- Paywall-Käufe vermeiden die Bindung des Bestätigungsdialogs von Apple an ein bestimmtes App-Fenster.
- Die Bestätigung des Apple-Abonnements ist bei Konfigurationen mit mehreren Displays zuverlässiger und bietet eine gezielte Diagnose für verdächtige Bestätigungsfehler.

# 1.0.1

- Neue Aufzeichnungen werden automatisch als .cam-Arbeitsbereiche an einem konfigurierbaren Standardspeicherort gespeichert, bevor der Editor geöffnet wird.
- Die Aufzeichnungseinstellungen zeigen den automatisch gespeicherten Arbeitsbereich und die Cache-Größe der Rohaufzeichnung an, mit Bereinigung für alte oder alle Cache-Elemente.
- Die Einstellungen fügen Darstellungssteuerelemente für Designfarbe, Symbolleistenmaterial und Tooltip-Material hinzu.
- Zu den Einstellungen gehören „Bei Anmeldung öffnen“, größere Tastenkombinationen während der Aufnahme, entfernbare Tastenkombinationen und der Export aktueller Fehlerprotokolle.
- Das Menü „Datei“ fügt die Untermenüs „Zuletzt verwendet“ und „Standardverzeichnis“ zum Öffnen gespeicherter Arbeitsbereiche hinzu.
- Der Editor-Header fügt voreingestellte Aktionen zum Speichern, Umbenennen, Neuanordnen, Löschen, Anwenden, Teilen und Importieren hinzu.
- Der Editor-Header fügt weitere Export-Canvas-Aspektvoreinstellungen, Steuerelemente zum Zuschneiden der Quelle und 5K-begrenzte Quellexporte hinzu.
- Der Editortitel kann den Arbeitsbereich in Finder verraten.
- Die Reihenfolge der Timeline-Tracks bleibt als Editor-Einstellung bestehen, während ausgeblendete Tracks pro Sitzung zurückgesetzt werden.
- Timeline und Quellzuschnitt unterstützen den Pinch-Zoom mit dem Trackpad, mit Schwenken im Zuschneideblatt nach dem Zoomen.
- Die Bereichsauswahl unterstützt eingegebene Abmessungen, Mittelhilfslinien, Voreinstellungen für Seitenverhältnisse und Tastenkombinationen zur Größenänderung von Shift/Option.
- Die Timeline-Vorschausteuerung erhöht die Wiedergabegeschwindigkeit von 0,25x bis 2x.
- Kameraschönheitsfilter können während der Aufnahme in der Vorschau angezeigt und umgeschaltet, als Standard gespeichert, später angepasst und mit gesichtsbezogenen Formsteuerelementen verfeinert werden.
- Die Standardeinstellungen für die Kameraanimation verwenden ein weicheres Federprofil und eine stärkere Bewegungsunschärfe für sanftere Zooms.
- Die Vorschau der Kamerabewegung sorgt dafür, dass kantenbegrenzte Ein- und Auszoompfade gerade bleiben und gerichtete Bewegungsunschärfe aus der richtigen Zoommitte verwendet wird.
- Die Cursorwiedergabe folgt der aufgezeichneten Bewegung mit weniger Verzögerung.
- Cursorposition und Kamerafokus bleiben nach dem Zuschneiden der Quelle ausgerichtet.
- Kamera-Overlays bleiben während der Vorschauwiedergabe mit ihrem Bild synchronisiert.
- Der Aufnahmestopp schaltet sofort auf ProVerarbeitung um und hält die Finalisierung länger aufrecht.
- Die schwebende Aufzeichnungssymbolleiste bleibt sichtbar, wenn Sie während der Aufzeichnung den Desktop wechseln.
- Die Audioanzeigen in der Aufnahmesymbolleiste zeigen deutlichere Pegelbewegungen an.
- Die Auswahl der Bereichserfassung wird zuverlässig über die schwebende Aufzeichnungssymbolleiste angezeigt.
- Die Auswahl von Fenster- und Bereichsaufnahmen funktioniert auf sekundären Displays.
- Wenn Sie die Berechtigung zur Bildschirmaufzeichnung verweigern, wird die Aufzeichnung abgebrochen, ohne dass ein Fehler angezeigt wird.
- Die Steuerung der Aufnahmeauswahl verhindert Abstürze von Intel TestFlight, einschließlich Ziel-Hover, Menüaktualisierungen des Menüleistenstatus und erneutem Öffnen vom Dock aus.
- Die Schaltfläche zum Abbrechen der Aufnahmeauswahl reagiert auf die gesamte kreisförmige Steuerung.
- Wenn Sie mit der Maus über die Startschaltfläche für die Aufnahmeauswahl fahren, stürzt die App nicht mehr ab.
- Aufnahmen mit aktiviertem Systemaudio werden beendet, ohne dass der Processing hängen bleibt.
- Beim Schließen oder Beenden mit einem nicht gespeicherten Editor wird der Schließablauf von ScreenCam anstelle des Fensters zum Speichern von Systemdokumenten angezeigt.
- Die automatische Speicherung im Arbeitsbereich wartet, während native Dateifenster geöffnet sind, und schreibt .cam-Pakete sicherer.
- Timeline-Scrubbing und unterbrochene Interaktionen führen nicht mehr dazu, dass die Vorschauwiedergabe einfriert oder zum Ende springt.
- Beim Ändern der Größe oder Ziehen von Timeline-Clips springt der Abspielkopf nicht mehr, wenn ein Clip gegriffen wird.
- Die Stumm- und Lautstärkeregler für die Vorschau bleiben synchron, animieren reibungslos und es werden keine Rückgängig-Schritte mehr hinzugefügt.
- Farbwähler akzeptieren eingegebene Hexadezimalwerte und lassen die Ziehpunkte beim Anpassen der Farbe verankert.
- Inspektorbeschriftungen verwenden die Terminologie „Bildschirm“ und „Gerät“, und die Größenvoreinstellungsauswahl entspricht anderen Menüsteuerelementen.
- Tooltips werden auf Aufnahmesteuerelementen, Inspektor-Registerkarten und Rückgängig-/Wiederherstellen-Verknüpfungen angezeigt.
- Klares Tooltip-Material sorgt dafür, dass schwebende Blasen auf weißem Hintergrund sichtbar sind.
- Exportierte MP4-Videos verwenden die mit der Vorschau kompatible Bildreihenfolge H.264, vermeiden Quarantäne-Metadaten und behalten das Audio-Timing mit normaler Geschwindigkeit bei.
- Die Exportgröße in Quellauflösung verwendet die endgültige Vorschaukomposition, einschließlich Rahmenabstand, fester Leinwandgröße und Mockup-Größe.
- Bei exportierten Leinwänden werden durch Pixelrundung verursachte schwarze Kantenränder vermieden.
- Display-Mockup-Exporte rendern animierte Hintergrundbilder und Rahmenhintergründe korrekt innerhalb des Bildschirmrahmens.
- Laptop-Modell exportiert Clip-Aufnahmeinhalte in abgerundete Bildschirmecken.
- Mockup-Zooms können der Cursorbewegung über den Quellrand hinaus folgen, ohne dass das vergrößerte Gerät am Leinwandrand einrastet.
- Wiederholte Aufnahmeclips werden aus den richtigen Quellbildern exportiert und nicht aus veralteten Endbildern.
- 4K-Exporte starten zuverlässig bei hochauflösenden Aufnahmen, anstatt bei etwa 3 % ins Stocken zu geraten.
- Lange Exporte mit animierten Hintergrundbildern oder Kamera-Overlays bleiben nicht mehr in der Nähe von 79 % stehen.
- Bei Audioexporten in voller Lautstärke bleibt die Bitrate des gerenderten H.264-Videos erhalten, anstatt die Dateigröße beim Audio-Muxen zu erhöhen.
- Aufnahme, Vorschauwiedergabe, hochauflösender Export und große Tastatur-Timelines verbrauchen weniger CPU und Speicher.
- Die Ampelschaltflächen des Editors behalten die native Positionierung während Vollbildübergängen bei.
