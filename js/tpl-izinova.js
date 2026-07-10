// GÉNÉRÉ (rédigé) — ordonnance + guide IZINOVA®, même gabarit que les 4 autres préparations.
// Consignes : prise fractionnée (Dr L. Meunier / RCP IZINOVA), tableau d'horaires standard du service.
export const IZINOVA = {
  product: "IZINOVA®",
  html: `
  <!-- running footer -->
  <div slot="footer" style="display:flex; justify-content:space-between; align-items:center; font-family:'Barlow',sans-serif; font-size:9px; color:#7a8794; border-top:1px solid #d9e2ea; padding-top:5px;">
    <span>CHU de Montpellier — Endoscopie digestive · 04 67 33 70 67</span>
    <span style="font-family:'Barlow Condensed',sans-serif; letter-spacing:.05em; text-transform:uppercase; color:#0072BC; font-weight:600;">Préparation coloscopie · IZINOVA®</span>
  </div>

  <!-- ============ PAGE 1 : ORDONNANCE ============ -->
  <div data-pg="0" class="pptx-page">
  <div style="display:flex; gap:16px; align-items:flex-start; border-bottom:2px solid #0072BC; padding-bottom:12px;">
    <div style="flex:1; font-family:'Barlow',sans-serif; color:#0d2b45;">
      <div style="font-family:'Barlow',sans-serif; font-weight:700; font-size:15px; line-height:1.15;">@@MED_NOM@@</div>
      <div style="font-size:12px; color:#0072BC; font-weight:600;">@@MED_SPEC@@</div>
      <div style="font-size:11px; color:#4a5b68; margin-top:4px; line-height:1.5;">CHU de Montpellier<br>Hospitalisation : 04 67 33 70 65<br>@@MED_TEL_LINE@@</div>
      @@RPPS_BLOCK@@
    </div>
    <div style="flex:none; text-align:center;">
      <img src="chu-logo.webp" alt="CHU de Montpellier" style="height:66px; width:auto;">
    </div>
    <div style="flex:1; text-align:right; font-family:'Barlow',sans-serif; color:#0d2b45;">
      <div style="font-weight:700; font-size:13px;">Endoscopie digestive</div>
      <div style="font-size:11px; color:#4a5b68; margin-top:3px; line-height:1.5;">80, avenue Augustin Fliche<br>34295 Montpellier Cedex 5<br>Tél. 04 67 33 70 67 / 04 67 33 54 85<br>endoscopie.ste@chu-montpellier.fr</div>
    </div>
  </div>

  <div style="display:flex; gap:14px; margin-top:12px; align-items:stretch;">
    @@PATIENT_BOX@@
    <div style="flex:1; display:flex; flex-direction:column; justify-content:center; gap:6px; font-family:'Barlow',sans-serif;">
      <div style="display:flex; gap:14px; align-items:center;">
        <div style="font-family:'Barlow Condensed',sans-serif; font-size:11px; color:#4a5b68; text-transform:uppercase; letter-spacing:.04em;">Cerfa N° 60-3937</div>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        @@FINESS_BARCODE@@
        <span style="font-size:10px; color:#4a5b68;">FINESS 340782036</span>
      </div>
    </div>
  </div>

  <div style="text-align:center; margin-top:20px;">
    <div style="display:inline-block; font-family:'Barlow',sans-serif; font-weight:800; font-size:26px; letter-spacing:.14em; color:#0d2b45; border-bottom:3px solid #EF7D00; padding-bottom:4px;">ORDONNANCE</div>
  </div>

  <div style="font-family:'Barlow',sans-serif; color:#1c3a52; margin-top:18px;">
    <div style="background:#EAF3FB; border-left:4px solid #0072BC; border-radius:0 8px 8px 0; padding:10px 16px; font-weight:600; font-size:14px;">
      Préparation colique IZINOVA® — à retirer en pharmacie en vue de la coloscopie
    </div>
    <div style="font-size:11px; color:#6b7c8a; font-style:italic; margin-top:14px;">Prescriptions relatives au traitement de l'affection de longue durée reconnue (liste ou hors liste)</div>

    <div style="margin-top:14px; display:flex; flex-direction:column; gap:12px; font-size:14.5px; line-height:1.5;">
      <div style="display:flex; gap:12px;">
        <span style="flex:none; width:7px; height:7px; border-radius:50%; background:#0072BC; margin-top:8px;"></span>
        <span><strong>IZINOVA®</strong> — 1 coffret (2 flacons de 176 mL + godet doseur), en <strong>prise fractionnée</strong> : flacon 1 la veille au soir + flacon 2 le matin de l'examen.</span>
      </div>
      <div style="display:flex; gap:12px;">
        <span style="flex:none; width:7px; height:7px; border-radius:50%; background:#0072BC; margin-top:8px;"></span>
        <span><strong>Régime sans résidu strict</strong> pendant les 48 h précédant l'examen.</span>
      </div>
      <div style="display:flex; gap:12px;">
        <span style="flex:none; width:7px; height:7px; border-radius:50%; background:#0072BC; margin-top:8px;"></span>
        <span>Qsp 1 préparation colique pour coloscopie.</span>
      </div>
    </div>

    <div style="font-size:12px; color:#6b7c8a; margin-top:16px; line-height:1.5;">Ordonnance établie pour la délivrance en pharmacie de la préparation colique nécessaire à la coloscopie. Les consignes détaillées de préparation figurent dans le guide patient ci-après.</div>
  </div>

  <div style="display:flex; justify-content:flex-end; margin-top:34px;">
    <div style="width:300px; font-family:'Barlow',sans-serif; color:#1c3a52;">
      @@DATE_LINE@@
      <div style="font-weight:700; font-size:14px; margin-top:22px;">@@MED_NOM@@</div>
      <div style="font-size:11px; color:#4a5b68;">@@MED_SPEC@@ — CHU de Montpellier</div>
      <div style="border-top:1px dashed #9db4c6; margin-top:40px; padding-top:5px; font-size:10.5px; color:#8a9aa8; text-align:center;">Signature et cachet du prescripteur</div>
    </div>
  </div>

  </div>

  <!-- ============ PAGE 2 : GUIDE ============ -->
  <div data-pg="1" class="page-break pptx-page" style="font-family:'Barlow',sans-serif; padding-top:4px;">
    <div style="background:#0d2b45; color:#fff; border-radius:12px; padding:22px 26px; position:relative; overflow:hidden;">
      <div style="position:absolute; right:-40px; top:-40px; width:150px; height:150px; border-radius:50%; background:#0072BC; opacity:.35;"></div>
      <div style="font-family:'Barlow Condensed',sans-serif; letter-spacing:.08em; text-transform:uppercase; font-size:13px; color:#8fc2ea; position:relative;">Guide patient · Coloscopie</div>
      <h1 style="font-weight:800; font-size:30px; line-height:1.05; margin:6px 0 2px; position:relative;">Préparation colique fractionnée</h1>
      <div style="font-weight:600; font-size:20px; color:#EF7D00; position:relative;">IZINOVA®</div>
      <div style="font-size:11px; color:#b9cfe2; margin-top:4px; position:relative;">sulfates de sodium, magnésium et potassium — faible volume (2 × 500 mL)</div>
    </div>

    <div style="margin-top:18px;">
      <div style="font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:.05em; font-size:15px; color:#0072BC; font-weight:700;">L'essentiel — 2 gestes à retenir</div>

      <div style="display:flex; gap:14px; margin-top:12px; align-items:stretch;">
        <div style="flex:1; border:1px solid #cfe1f0; border-radius:12px; overflow:hidden; display:flex; flex-direction:column;">
          <div style="background:#0072BC; color:#fff; padding:11px 16px; display:flex; align-items:center; gap:12px;">
            <div style="flex:none; width:34px; height:34px; border-radius:50%; background:#fff; color:#0072BC; font-weight:800; font-size:18px; display:flex; align-items:center; justify-content:center;">1</div>
            <div>
              <div style="font-family:'Barlow Condensed',sans-serif; font-size:12px; opacity:.85; text-transform:uppercase; letter-spacing:.04em;">48 h avant</div>
              <div style="font-weight:700; font-size:16px; line-height:1.1;">Régime sans résidu</div>
            </div>
          </div>
          <div style="padding:12px 16px; font-size:13px; color:#1c3a52; line-height:1.5;">Les 2 jours qui précèdent l'examen (J-2 et J-1) : <strong>pas de fibres</strong>. On supprime fruits, légumes, laitages, pain et céréales complets.</div>
        </div>
        <div style="flex:1; border:1px solid #cfe1f0; border-radius:12px; overflow:hidden; display:flex; flex-direction:column;">
          <div style="background:#005a94; color:#fff; padding:11px 16px; display:flex; align-items:center; gap:12px;">
            <div style="flex:none; width:34px; height:34px; border-radius:50%; background:#fff; color:#005a94; font-weight:800; font-size:18px; display:flex; align-items:center; justify-content:center;">2</div>
            <div>
              <div style="font-family:'Barlow Condensed',sans-serif; font-size:12px; opacity:.85; text-transform:uppercase; letter-spacing:.04em;">veille + matin</div>
              <div style="font-weight:700; font-size:16px; line-height:1.1;">Préparation fractionnée</div>
            </div>
          </div>
          <div style="padding:12px 16px; font-size:13px; color:#1c3a52; line-height:1.5;">La préparation se boit <strong>en deux fois</strong> : un flacon la veille au soir, un flacon le matin de l'examen <em>(horaires dans le tableau ci-dessous)</em>.</div>
        </div>
      </div>

      <div style="display:flex; gap:14px; margin-top:14px; align-items:stretch;">
        <div style="flex:1; border:1px solid #cfe1f0; border-radius:10px; padding:12px 16px;">
          <div style="font-family:'Barlow Condensed',sans-serif; color:#0072BC; font-weight:700; text-transform:uppercase; font-size:12px; letter-spacing:.04em;">A · La veille au soir</div>
          <div style="font-size:13px; color:#1c3a52; margin-top:6px; line-height:1.55;">Vers <strong>18 h</strong> : diluer le <strong>flacon 1</strong> dans le godet doseur complété à <strong>500 mL</strong> d'eau fraîche, à boire en 1 h.<br>Puis de <strong>19 h à 20 h</strong> : boire <strong>1 L de liquides clairs</strong>.</div>
        </div>
        <div style="flex:1; border:1px solid #cfe1f0; border-radius:10px; padding:12px 16px;">
          <div style="font-family:'Barlow Condensed',sans-serif; color:#005a94; font-weight:700; text-transform:uppercase; font-size:12px; letter-spacing:.04em;">B · Le matin de l'examen</div>
          <div style="font-size:13px; color:#1c3a52; margin-top:6px; line-height:1.55;">À l'heure du tableau : <strong>flacon 2</strong> dilué dans le godet à <strong>500 mL</strong>, à boire en 1 h, puis <strong>1 L de liquides clairs</strong> en 1 h. <strong style="color:#C0392B;">Dernière gorgée ≥ 3 h avant l'anesthésie.</strong></div>
        </div>
      </div>

      <div style="display:flex; gap:12px; align-items:flex-start; margin-top:14px; background:#FFF4E6; border:1px solid #f3c98a; border-radius:10px; padding:12px 16px;">
        <div style="flex:none; font-weight:800; color:#EF7D00; font-size:15px; font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:.03em;">Règle d'or</div>
        <div style="font-size:13px; color:#6b4a1a; line-height:1.5;">Ne prenez <strong>jamais</strong> toute la préparation en une seule fois. Les deux prises — la veille <strong>ET</strong> le matin — sont indispensables pour un côlon propre. <strong>Liquides clairs</strong> = eau, soupe filtrée, jus sans pulpe, thé, café, boissons sans alcool — <strong>PAS DE LAIT</strong>.</div>
      </div>

      <div style="margin-top:16px; break-inside:avoid;">
        <div style="font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:.05em; font-size:15px; color:#0072BC; font-weight:700;">Vos horaires selon l'heure de la coloscopie</div>
        <table style="width:100%; border-collapse:collapse; margin-top:8px; font-family:'Barlow',sans-serif; border:1px solid #cfe1f0; border-radius:8px; overflow:hidden;">
          <thead>
            <tr>
              <th style="padding:7px 10px; background:#0d2b45; color:#fff; font-size:12px; text-align:left;">Heure de la coloscopie</th>
              <th style="padding:7px 10px; background:#146c3a; color:#fff; font-size:12px; text-align:center;">Je commence le flacon 2 à</th>
              <th style="padding:7px 10px; background:#a5271a; color:#fff; font-size:12px; text-align:center;">Je finis de boire au plus tard à</th>
            </tr>
          </thead>
          <tbody>
<tr>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;font-weight:700; color:#0d2b45; background:#f4f8fc;">8 h 00</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#146c3a; background:#E6F4EC;">3 h 00</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#a5271a; background:#FBE9E6;">5 h 00</td>
          </tr>
<tr>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;font-weight:700; color:#0d2b45; background:#ffffff;">8 h 30</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#146c3a; background:#EEF8F1;">3 h 30</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#a5271a; background:#FDF0EE;">5 h 30</td>
          </tr>
<tr>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;font-weight:700; color:#0d2b45; background:#f4f8fc;">9 h 00</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#146c3a; background:#E6F4EC;">4 h 00</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#a5271a; background:#FBE9E6;">6 h 00</td>
          </tr>
<tr>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;font-weight:700; color:#0d2b45; background:#ffffff;">9 h 30</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#146c3a; background:#EEF8F1;">4 h 30</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#a5271a; background:#FDF0EE;">6 h 30</td>
          </tr>
<tr>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;font-weight:700; color:#0d2b45; background:#f4f8fc;">10 h 00</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#146c3a; background:#E6F4EC;">5 h 00</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#a5271a; background:#FBE9E6;">7 h 00</td>
          </tr>
<tr>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;font-weight:700; color:#0d2b45; background:#ffffff;">10 h 30</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#146c3a; background:#EEF8F1;">5 h 30</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#a5271a; background:#FDF0EE;">7 h 30</td>
          </tr>
<tr>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;font-weight:700; color:#0d2b45; background:#f4f8fc;">11 h 00</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#146c3a; background:#E6F4EC;">6 h 00</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#a5271a; background:#FBE9E6;">8 h 00</td>
          </tr>
<tr>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;font-weight:700; color:#0d2b45; background:#ffffff;">11 h 30</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#146c3a; background:#EEF8F1;">6 h 30</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#a5271a; background:#FDF0EE;">8 h 30</td>
          </tr>
<tr>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;font-weight:700; color:#0d2b45; background:#f4f8fc;">12 h 00</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#146c3a; background:#E6F4EC;">7 h 00</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#a5271a; background:#FBE9E6;">9 h 00</td>
          </tr>
<tr>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;font-weight:700; color:#0d2b45; background:#ffffff;">12 h 30</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#146c3a; background:#EEF8F1;">7 h 30</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#a5271a; background:#FDF0EE;">9 h 30</td>
          </tr>
<tr>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;font-weight:700; color:#0d2b45; background:#f4f8fc;">13 h 00</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#146c3a; background:#E6F4EC;">8 h 00</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#a5271a; background:#FBE9E6;">10 h 00</td>
          </tr>
<tr>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;font-weight:700; color:#0d2b45; background:#ffffff;">13 h 30</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#146c3a; background:#EEF8F1;">8 h 30</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#a5271a; background:#FDF0EE;">10 h 30</td>
          </tr>
<tr>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;font-weight:700; color:#0d2b45; background:#f4f8fc;">14 h 00</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#146c3a; background:#E6F4EC;">9 h 00</td>
            <td style="padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;text-align:center; font-weight:700; color:#a5271a; background:#FBE9E6;">11 h 00</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
`,
};
