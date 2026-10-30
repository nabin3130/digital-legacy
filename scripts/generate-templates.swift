import AppKit
import CoreText
import Foundation

final class TemplatePage: NSView {
    let titleText: String
    let subtitle: String
    let sections: [(String, [String])]
    let footer: String
    let locale: String
    override var isFlipped: Bool { true }

    init(title: String, subtitle: String, sections: [(String, [String])], footer: String, locale: String) {
        self.titleText = title
        self.subtitle = subtitle
        self.sections = sections
        self.footer = footer
        self.locale = locale
        super.init(frame: NSRect(x: 0, y: 0, width: 595.28, height: 841.89))
    }

    required init?(coder: NSCoder) { nil }

    func text(_ value: String, x: CGFloat, y: CGFloat, width: CGFloat, size: CGFloat, color: NSColor, weight: NSFont.Weight = .regular) {
        let fontName = locale == "ko" ? "AppleSDGothicNeo-Regular" : "HelveticaNeue"
        let font = CTFontCreateWithName(fontName as CFString, size, nil)
        var characters = Array(value.utf16).map { UniChar($0) }
        let count = characters.count
        var glyphs = Array(repeating: CGGlyph(0), count: count)
        guard count > 0 else { return }
        _ = CTFontGetGlyphsForCharacters(font, &characters, &glyphs, count)
        var advances = Array(repeating: CGSize.zero, count: count)
        _ = CTFontGetAdvancesForGlyphs(font, .horizontal, &glyphs, &advances, count)
        let context = NSGraphicsContext.current!.cgContext
        color.setFill()
        var pen: CGFloat = 0
        var line = 0
        for index in 0..<count {
            let character = characters[index]
            if character == 10 || (pen > 0 && pen + advances[index].width > width) {
                line += 1; pen = 0
            }
            if character != 10 {
                if let glyphPath = CTFontCreatePathForGlyph(font, glyphs[index], nil) {
                    var transform = CGAffineTransform(a: 1, b: 0, c: 0, d: -1, tx: x + pen, ty: y + CGFloat(line) * (size + 3) + size)
                    if let outline = glyphPath.copy(using: &transform) { context.addPath(outline) }
                }
                pen += advances[index].width
            }
        }
        context.fillPath()
    }

    func rule(_ x1: CGFloat, _ y: CGFloat, _ x2: CGFloat) {
        NSColor(calibratedRed: 0.80, green: 0.84, blue: 0.84, alpha: 1).setStroke()
        let path = NSBezierPath(); path.lineWidth = 0.75
        path.move(to: NSPoint(x: x1, y: y)); path.line(to: NSPoint(x: x2, y: y)); path.stroke()
    }

    override func draw(_ dirtyRect: NSRect) {
        NSColor(calibratedRed: 0.973, green: 0.969, blue: 0.949, alpha: 1).setFill(); bounds.fill()
        let navy = NSColor(calibratedRed: 0.145, green: 0.235, blue: 0.290, alpha: 1)
        let mist = NSColor(calibratedRed: 0.443, green: 0.529, blue: 0.580, alpha: 1)
        let margin: CGFloat = 48
        text("LOGOUT  /  DIGITAL LEGACY", x: margin, y: 42, width: 480, size: 10, color: mist, weight: .medium)
        rule(margin, 66, 547)
        text(titleText, x: margin, y: 89, width: 490, size: 24, color: navy, weight: .semibold)
        text(subtitle, x: margin, y: 126, width: 490, size: 11, color: mist)
        var y: CGFloat = 172
        for (heading, rows) in sections {
            text(heading, x: margin, y: y, width: 490, size: 13, color: navy, weight: .semibold)
            y += 27
            for row in rows {
                text(row, x: margin, y: y, width: 490, size: 10, color: mist)
                rule(margin, y + 32, 547)
                y += 44
            }
            y += 12
        }
        rule(margin, 777, 547)
        text(footer, x: margin, y: 793, width: 490, size: 8.5, color: mist)
    }
}

let output = URL(fileURLWithPath: CommandLine.arguments.dropFirst().first ?? "public/templates", isDirectory: true)
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)

let korean = [
    ("digital-account-inventory", "디지털 계정 목록", "서비스와 보관할 기록을 적습니다. 비밀번호나 인증 코드는 적지 마세요.", [("계정과 기록", ["서비스 / 계정 식별 힌트 / 보관할 기록", "서비스 / 계정 식별 힌트 / 보관할 기록", "서비스 / 계정 식별 힌트 / 보관할 기록", "서비스 / 계정 식별 힌트 / 보관할 기록", "서비스 / 계정 식별 힌트 / 보관할 기록", "서비스 / 계정 식별 힌트 / 보관할 기록"]), ("다음에 확인할 일", ["다음 행동 / 담당할 사람 / 확인 날짜", "다음 행동 / 담당할 사람 / 확인 날짜"])]),
    ("family-instructions", "가족에게 남기는 디지털 안내", "확인할 위치와 연락처를 남깁니다. 비밀정보는 별도로 안전하게 보관하세요.", [("안내를 맡아줄 사람", ["이름 / 연락처 / 관계", "대신 연락할 사람 / 연락처"]), ("확인할 곳", ["기기나 기록을 확인할 위치", "연락할 서비스 또는 공식 고객센터", "기억해 둘 요청이나 주의할 점", "이 안내를 마지막으로 확인한 날짜"])]),
    ("recovery-checklist", "복구 수단 점검표", "복구 수단이 어디에 보관되어 있는지만 적습니다. 코드 자체는 적지 마세요.", [("서비스별 점검", ["서비스 / 2단계 인증 방법 / 복구 코드 보관 위치", "서비스 / 2단계 인증 방법 / 복구 코드 보관 위치", "서비스 / 2단계 인증 방법 / 복구 코드 보관 위치", "서비스 / 2단계 인증 방법 / 복구 코드 보관 위치"]), ("점검 날짜", ["복구 연락처 확인일 / 다음 점검일", "점검을 도와줄 사람 / 연락 방법"])]),
]
let english = [
    ("digital-account-inventory", "Digital account inventory", "List services and records to preserve. Do not write passwords or authentication codes.", [("Accounts and records", ["Service / account clue / records to keep", "Service / account clue / records to keep", "Service / account clue / records to keep", "Service / account clue / records to keep", "Service / account clue / records to keep", "Service / account clue / records to keep"]), ("Next steps", ["Next action / person to contact / date", "Next action / person to contact / date"])]),
    ("family-instructions", "Digital instructions for family", "Leave places to check and contacts. Store credentials separately and securely.", [("Person to contact", ["Name / contact details / relationship", "Alternate contact / contact details"]), ("Places and services to check", ["Where to find devices or records", "Service or official support contact", "Notes and requests to keep in mind", "Date this note was last reviewed"])]),
    ("recovery-checklist", "Account recovery checklist", "Record where recovery materials are stored. Do not write down the codes themselves.", [("Service checks", ["Service / two-factor method / recovery code storage location", "Service / two-factor method / recovery code storage location", "Service / two-factor method / recovery code storage location", "Service / two-factor method / recovery code storage location"]), ("Review dates", ["Recovery contact checked / next review date", "Person to help with a review / how to reach them"])]),
]

for (locale, rows) in [("ko", korean), ("en", english)] {
    for (filename, title, subtitle, sections) in rows {
        let warning = locale == "ko" ? "비밀번호나 복구 정보를 적지 마세요. 공식 서비스 안내를 확인하세요." : "Do not write passwords or recovery material here. Use official service instructions."
        let page = TemplatePage(title: title, subtitle: subtitle, sections: sections, footer: warning, locale: locale)
        let data = page.dataWithPDF(inside: page.bounds)
        try data.write(to: output.appendingPathComponent("\(filename)-\(locale).pdf"))
    }
}
