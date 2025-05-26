---
type: PageLayout
pageCssClasses: rtl-block 
title: تواصل معنا
sections:
  - type: DividerSection
    title: Divider
    elementId: ''
    colors: bg-light-fg-dark
    styles:
      self:
        padding:
          - pt-3
          - pl-3
          - pb-3
          - pr-3
  - type: GenericSection
    title:
      type: TitleBlock
      text: Let's talk a little عربي
      color: text-dark
    subtitle: عربي
    text: |
      غربي
    actions:
      - type: Link
        altText: Message on WhatsApp
        url: 'https://wa.me/97366761322'
        showIcon: true
        icon: whatsapp
        iconPosition: left
        style: secondary
        elementId: ''
        label: Message on WhatsApp
      - type: Link
        label: Send Email
        altText: Send an Email
        url: 'https://mailto:info@fawri-plus.com'
        showIcon: true
        icon: mail
        iconPosition: left
        style: secondary
        elementId: ''
    media:
      type: FormBlock
      fields:
        - type: TextFormControl
          name: name
          label: Name
          hideLabel: true
          placeholder: Your name
          isRequired: true
          width: full
        - type: TextFormControl
          name: Mobile Number
          label: Mobile Number
          hideLabel: true
          placeholder: Your mobile number
          isRequired: true
          width: full
        - type: EmailFormControl
          name: email
          label: Email
          hideLabel: true
          placeholder: Your email
          isRequired: true
          width: full
        - type: TextareaFormControl
          name: message
          label: Message
          hideLabel: true
          placeholder: Your message
          width: full
      submitButton:
        type: SubmitButtonFormControl
        label: Submit
        icon: arrowRight
        iconPosition: right
        style: primary
      elementId: contact-form
      styles:
        self:
          padding:
            - pt-6
            - pb-6
            - pl-6
            - pr-6
          borderColor: border-dark
          borderStyle: solid
          borderWidth: 1
          borderRadius: large
    badge:
      type: Badge
      label: Contact Us
      color: text-primary
    colors: bg-light-fg-dark
  - type: DividerSection
    title: Divider
    elementId: ''
    colors: bg-light-fg-dark
    styles:
      self:
        padding:
          - pt-3
          - pl-3
          - pb-3
          - pr-3
slug: ar/contact
isDraft: false
---
