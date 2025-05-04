---
type: PageLayout
title: 'Contact Us '
sections:
  - type: GenericSection
    title:
      type: TitleBlock
      text: Let's talk a little
      color: text-dark
    subtitle: We’re happy to discuss your options with Fawri+
    text: >+
      Your suggestions, feedback, and questions are important to us. We will
      gladly respond to any inquiries you may have.



    actions:
      - type: Link
        label: Send email
        altText: Play
        url: /
        showIcon: true
        icon: mail
        iconPosition: right
        style: secondary
        elementId: ''
      - type: Link
        label: ''
        altText: Instagram
        url: /
        showIcon: true
        icon: instagram
        iconPosition: left
        style: primary
        elementId: ''
      - type: Link
        altText: Facebook
        url: /
        showIcon: true
        icon: facebook
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
slug: contact
isDraft: false
---
